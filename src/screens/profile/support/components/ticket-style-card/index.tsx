import { Logo } from "@assets/svgs";
import { useTheme } from "@context/Theme/ThemeContext";
import { generateBarcode } from "@utils/pick-random/barcode";
import type { ReactNode } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

const CARD_WIDTH = Dimensions.get("window").width - 48;
const DASH_W = 6;
const DASH_GAP = 4;
const DASH_COUNT = Math.floor(CARD_WIDTH / (DASH_W + DASH_GAP));

function DashedLine({ color }: { color: string }) {
  return (
    <View style={ds.row}>
      {Array.from({ length: DASH_COUNT }).map((_, i) => (
        <View key={i} style={[ds.seg, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const ds = StyleSheet.create({
  row: { flex: 1, flexDirection: "row", alignItems: "center", gap: DASH_GAP },
  seg: { width: DASH_W, height: 1.5, borderRadius: 1 },
});

const BARCODE_W = 240;
const BARCODE_H = 56;
const BAR_GAP = 1.5;

/** Unique, deterministic barcode rendered from the ticket value. */
function Barcode({ value, color }: { value: string; color: string }) {
  const bars = generateBarcode(value, 60);
  const totalWidth = bars.reduce((acc, b) => acc + b.width + BAR_GAP, 0) - BAR_GAP;
  let x = (BARCODE_W - totalWidth) / 2;

  return (
    <Svg width={BARCODE_W} height={BARCODE_H} viewBox={`0 0 ${BARCODE_W} ${BARCODE_H}`}>
      {bars.map((b, i) => {
        const rectX = x;
        x += b.width + BAR_GAP;
        return (
          <Rect key={i} x={rectX} y={4} width={b.width} height={BARCODE_H - 8} fill={color} opacity={b.opacity} />
        );
      })}
    </Svg>
  );
}

type Props = {
  /** Content in the tinted top section (above the body). */
  head?: ReactNode;
  /** Content in the middle body section. */
  children: ReactNode;
  /** Text shown under the barcode in the footer (e.g. the ticket number). */
  footerText?: string;
  /** Hide the barcode footer. */
  hideFooter?: boolean;
};

/**
 * Movie-ticket styled card: tinted head → body → single perforation → barcode.
 * A single cut separates the ticket "stub" (barcode) from the rest.
 */
export default function TicketStyleCard({ head, children, footerText, hideFooter }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[s.ticket, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {head ? <View style={[s.head, { backgroundColor: colors.accent + "10" }]}>{head}</View> : null}

      <View style={s.body}>{children}</View>

      {!hideFooter ? (
        <>
          {/* Single perforation between the details and the barcode stub */}
          <View style={s.cutoutRow}>
            <View style={[s.cutout, s.cutoutLeft, { backgroundColor: colors.background }]} />
            <DashedLine color={colors.border} />
            <View style={[s.cutout, s.cutoutRight, { backgroundColor: colors.background }]} />
          </View>
          <View style={s.footer}>
            <View style={s.brandRow}>
              <Logo size={18} />
              <Text style={[s.brandText, { color: colors.textMuted }]}>Finora</Text>
            </View>
            <Barcode value={footerText || "FINORA"} color={colors.textPrimary} />
            {footerText ? (
              <Text style={[s.footerText, { color: colors.textSecondary }]}>{footerText}</Text>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );
}

/** Labelled value block used inside the ticket body. */
export function TicketInfoBlock({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={s.infoBlock}>
      <Text style={[s.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[s.infoValue, { color: accent ? colors.accent : colors.textPrimary }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  ticket: { width: "100%", borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, overflow: "visible" },
  head: { borderTopLeftRadius: 18, borderTopRightRadius: 18, alignItems: "center", paddingVertical: 24, paddingHorizontal: 20 },
  cutoutRow: { flexDirection: "row", alignItems: "center" },
  cutout: { width: 20, height: 20, borderRadius: 10, zIndex: 2 },
  cutoutLeft: { marginLeft: -10 },
  cutoutRight: { marginRight: -10 },
  body: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 16, gap: 14 },
  footer: { alignItems: "center", paddingVertical: 18, paddingHorizontal: 24, gap: 4 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  brandText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  footerText: { fontSize: 12, fontWeight: "700", marginTop: 4, letterSpacing: 2 },
  infoBlock: { flex: 1 },
  infoLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 },
  infoValue: { fontSize: 14, fontWeight: "700" },
});
