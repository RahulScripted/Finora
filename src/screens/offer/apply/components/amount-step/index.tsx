import { useTheme } from "@context/Theme/ThemeContext";
import Slider from "@react-native-community/slider";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Offer } from "@data-types/offers/constants";
import { formatRupees } from "@data-types/offers/constants";

type Props = {
  offer: Offer;
  amount: number;
  onChange: (v: number) => void;
};

/** Step 1 — pick the amount with a slider bounded by the offer limits. */
export default function AmountStep({ offer, amount, onChange }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const advancePct = offer.advancePct ?? 100;
  const willReceive = Math.round((amount * advancePct) / 100);

  // Snap to the nearest ₹10,000 for tidy values.
  const handleSlide = (v: number) => onChange(Math.round(v / 10_000) * 10_000);

  return (
    <View style={s.wrap}>
      <Text style={[s.prompt, { color: colors.textSecondary }]}>{t("offers.apply.how_much")}</Text>

      <Text style={[s.amount, { color: colors.textPrimary }]}>{formatRupees(amount)}</Text>
      <Text style={[s.eligible, { color: colors.textSecondary }]}>
        {t("offers.apply.eligible_up_to", { amount: formatRupees(offer.maxAmount) })}
      </Text>

      <Slider
        style={s.slider}
        minimumValue={offer.minAmount}
        maximumValue={offer.maxAmount}
        value={amount}
        onValueChange={handleSlide}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.accent}
      />
      <View style={s.bounds}>
        <Text style={[s.boundText, { color: colors.textMuted }]}>{formatRupees(offer.minAmount)}</Text>
        <Text style={[s.boundText, { color: colors.textMuted }]}>{formatRupees(offer.maxAmount)}</Text>
      </View>

      <View style={[s.receiveCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={s.receiveRow}>
          <Text style={[s.receiveLabel, { color: colors.textSecondary }]}>
            {t("offers.apply.you_will_receive")}
          </Text>
          <Text style={[s.receiveValue, { color: colors.textPrimary }]}>
            {formatRupees(willReceive)}
          </Text>
        </View>
        {advancePct < 100 ? (
          <Text style={[s.receiveNote, { color: colors.textMuted }]}>
            {t("offers.apply.advance_note", { pct: advancePct })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: "center", gap: 6, paddingTop: 24 },
  prompt: { fontSize: 14, marginBottom: 8 },
  amount: { fontSize: 40, fontWeight: "800", letterSpacing: -0.5 },
  eligible: { fontSize: 13, marginBottom: 20 },
  slider: { width: "100%", height: 40 },
  bounds: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 24 },
  boundText: { fontSize: 12 },
  receiveCard: { width: "100%", borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 6 },
  receiveRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  receiveLabel: { fontSize: 14 },
  receiveValue: { fontSize: 16, fontWeight: "700" },
  receiveNote: { fontSize: 12, lineHeight: 17 },
});
