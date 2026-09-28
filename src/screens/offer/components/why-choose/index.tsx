import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type Benefit = { key: string; icon: string; tint: string };

/** Benefit tiles — data-driven so they're easy to extend. */
const BENEFITS: Benefit[] = [
  { key: "quick_approval", icon: "flash-outline", tint: "#16A477" },
  { key: "secure_compliant", icon: "shield-check-outline", tint: "#3787D8" },
  { key: "flexible_repayment", icon: "calendar-outline", tint: "#7C5CFC" },
  { key: "trusted_business", icon: "account-group-outline", tint: "#E99A24" },
];

/** "Why choose Finora?" reassurance grid shown on the offer detail. */
export default function WhyChoose() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={s.wrap}>
      <Text style={[s.heading, { color: colors.textPrimary }]}>
        {t("offers.why_choose.title")}
      </Text>

      <View style={s.grid}>
        {BENEFITS.map((b) => (
          <View
            key={b.key}
            style={[s.tile, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[s.iconWrap, { backgroundColor: b.tint + "1F" }]}>
              <MaterialCommunityIcons name={b.icon as any} size={22} color={b.tint} />
            </View>
            <Text style={[s.label, { color: colors.textSecondary }]}>
              {t(`offers.why_choose.${b.key}`)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 12 },
  heading: { fontSize: 16, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
    flexGrow: 1,
    flexBasis: "22%",
    minWidth: 78,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 10,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11.5, fontWeight: "600", textAlign: "center", lineHeight: 16 },
});
