import BottomSheet from "@helpers/model";
import {
  DarkColors,
  LightColors,
  useTheme,
  type ThemeColors,
  type ThemePreference,
} from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

type Props = { visible: boolean; onClose: () => void };

const OPTIONS: { key: ThemePreference; icon: string; labelKey: string }[] = [
  { key: "system", icon: "cellphone", labelKey: "common.theme_system" },
  { key: "light", icon: "white-balance-sunny", labelKey: "common.theme_light" },
  { key: "dark", icon: "moon-waning-crescent", labelKey: "common.theme_dark" },
];

/* ------------------------------------------------------------------ */
/* Mini phone mock-up used inside each option card                    */
/* ------------------------------------------------------------------ */
function StatusIcons({ color }: { color: string }) {
  return (
    <View style={p.statusIcons}>
      <View style={p.signalGroup}>
        {[3, 4.5, 6, 7.5].map((h, i) => (
          <View key={i} style={[p.signalBar, { height: h, backgroundColor: color }]} />
        ))}
      </View>
      <View style={[p.battery, { borderColor: color }]}>
        <View style={[p.batteryFill, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

/** The inner content of a phone mock-up rendered for a given palette. */
function PhoneContent({ c, isDark }: { c: ThemeColors; isDark: boolean }) {
  const faint = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const fainter = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const muted = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)";

  return (
    <>
      <View style={p.statusBarRow}>
        <Text style={[p.timeText, { color: muted }]}>9:41</Text>
        <StatusIcons color={muted} />
      </View>
      <View style={[p.appHeader, { backgroundColor: c.primary }]}>
        <View style={[p.headerLine, { backgroundColor: "rgba(255,255,255,0.6)" }]} />
        <View style={[p.headerLineLg, { backgroundColor: "#FFFFFF" }]} />
      </View>
      <View style={p.cardRow}>
        {[0, 1].map((i) => (
          <View key={i} style={[p.contentCard, { backgroundColor: c.surface }]}>
            <View style={[p.cardLine, { backgroundColor: faint }]} />
            <View style={[p.cardLineSm, { backgroundColor: fainter }]} />
          </View>
        ))}
      </View>
      <View style={[p.listItem, { backgroundColor: fainter }]} />
      <View style={[p.listItem, { backgroundColor: fainter, width: "65%" }]} />
      <View style={{ flex: 1 }} />
      <View style={[p.tabBar, { backgroundColor: c.tabBar }]}>
        {["home", "file-document-outline", "credit-card-outline", "tag-outline", "dots-horizontal"].map(
          (name, i) => (
            <MaterialCommunityIcons
              key={i}
              name={name as any}
              size={7}
              color={i === 0 ? c.accent : muted}
            />
          ),
        )}
      </View>
    </>
  );
}

function MiniPreview({ themeKey }: { themeKey: ThemePreference }) {
  const systemScheme = useColorScheme();

  // System: split the phone diagonally-ish into a light top half and a dark
  // bottom half so it reads as "follows your device".
  if (themeKey === "system") {
    return (
      <View style={[p.phone, { backgroundColor: DarkColors.background, borderColor: "rgba(255,255,255,0.08)" }]}>
        <View style={p.systemHalf}>
          <View style={p.systemInner}>
            <PhoneContent c={LightColors} isDark={false} />
          </View>
        </View>
        <View style={[p.systemHalf, p.systemHalfBottom]}>
          {/* Offset the same content upward so the two halves line up into one phone */}
          <View style={[p.systemInner, p.systemInnerBottom]}>
            <PhoneContent c={DarkColors} isDark />
          </View>
        </View>
      </View>
    );
  }

  const resolved = themeKey === "dark" ? "dark" : "light";
  const c = resolved === "dark" ? DarkColors : LightColors;
  const isDark = resolved === "dark";

  return (
    <View
      style={[
        p.phone,
        { backgroundColor: c.background, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" },
      ]}
    >
      <PhoneContent c={c} isDark={isDark} />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Sheet                                                              */
/* ------------------------------------------------------------------ */
export default function ThemeSheet({ visible, onClose }: Props) {
  const { colors, preference, setPreference } = useTheme();
  const { t } = useTranslation();

  const handleSelect = useCallback(
    (key: ThemePreference) => {
      if (key !== preference) setPreference(key);
      onClose();
    },
    [preference, setPreference, onClose],
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("common.choose_theme")}>
      <View style={s.grid} accessibilityRole="radiogroup">
        {OPTIONS.map((opt) => {
          const active = opt.key === preference;
          return (
            <Pressable
              key={opt.key}
              onPress={() => handleSelect(opt.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={[
                s.card,
                { borderColor: active ? colors.accent : colors.border },
              ]}
            >
              <MiniPreview themeKey={opt.key} />
              <View style={s.labelRow}>
                {active ? (
                  <MaterialCommunityIcons name="check-circle" size={16} color={colors.accent} />
                ) : (
                  <MaterialCommunityIcons name={opt.icon as any} size={16} color={colors.textSecondary} />
                )}
                <Text
                  style={[s.label, { color: active ? colors.accent : colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {t(opt.labelKey)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: "row", gap: 10, paddingBottom: 8 },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    borderWidth: 2,
    overflow: "hidden",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  label: { fontSize: 13, fontWeight: "600" },
});

const p = StyleSheet.create({
  phone: {
    width: "100%",
    aspectRatio: 0.56,
    borderRadius: 10,
    borderWidth: 1,
    padding: 4,
    overflow: "hidden",
  },
  // System split halves
  systemHalf: { height: "50%", overflow: "hidden" },
  systemHalfBottom: {},
  systemInner: { height: "100%", padding: 4, paddingTop: 0 },
  systemInnerBottom: {
    // Pull the second render up so the "phone" reads as one continuous screen,
    // with the top half light and the bottom half dark.
    marginTop: "-100%",
  },
  statusBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
    marginBottom: 3,
    height: 7,
  },
  timeText: { fontSize: 4, fontWeight: "600", letterSpacing: 0.2 },
  statusIcons: { flexDirection: "row", alignItems: "center", gap: 3 },
  signalGroup: { flexDirection: "row", alignItems: "flex-end", gap: 0.5 },
  signalBar: { width: 1.5, borderRadius: 0.5 },
  battery: {
    width: 8,
    height: 4,
    borderRadius: 1,
    borderWidth: 0.5,
    justifyContent: "center",
    paddingHorizontal: 0.5,
  },
  batteryFill: { height: 2, width: "70%", borderRadius: 0.5 },
  appHeader: { borderRadius: 5, padding: 5, height: 24, marginBottom: 4 },
  headerLine: { height: 2, borderRadius: 1, width: "45%", marginBottom: 2 },
  headerLineLg: { height: 2.5, borderRadius: 1.25, width: "65%" },
  cardRow: { flexDirection: "row", gap: 3, marginBottom: 3 },
  contentCard: { flex: 1, height: 18, borderRadius: 4, padding: 3, justifyContent: "center", gap: 2 },
  cardLine: { height: 2, borderRadius: 1, width: "80%" },
  cardLineSm: { height: 1.5, borderRadius: 0.75, width: "55%" },
  listItem: { height: 5, borderRadius: 2.5, marginTop: 3 },
  tabBar: {
    height: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 3,
    marginHorizontal: -4,
    marginBottom: -4,
  },
});
