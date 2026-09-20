import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { CONTACT_SUPPORT_PHONE } from "@shared/contact-details";
import { GRIEVANCE_EMAIL, GRIEVANCE_OFFICER } from "@data-types/about/constants";
import InfoCard from "../shared/info-card";

const open = (url: string) => Linking.openURL(url).catch(() => undefined);

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Grievance officer card: description, officer identity, and call/email actions. */
export default function GrievanceCard() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <InfoCard padded>
      <Text style={[s.note, { color: colors.textSecondary }]}>{t("about_app.grievance_description")}</Text>
      <View style={[s.officer, { backgroundColor: colors.surface }]}>
        <View style={[s.avatar, { backgroundColor: colors.textPrimary }]}>
          <Text style={[s.avatarText, { color: colors.background }]}>{initialsOf(GRIEVANCE_OFFICER)}</Text>
        </View>
        <View style={s.rowText}>
          <Text style={[s.rowValue, { color: colors.textPrimary }]} numberOfLines={1}>
            {GRIEVANCE_OFFICER}
          </Text>
          <Text style={[s.rowLabel, { color: colors.textSecondary }]}>{t("about_app.officer_role")}</Text>
        </View>
        <Pressable
          onPress={() => open(`tel:${CONTACT_SUPPORT_PHONE}`)}
          accessibilityRole="button"
          accessibilityLabel={t("about_app.call_us")}
          style={({ pressed }) => [
            s.roundButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            pressed && s.pressed,
          ]}
        >
          <MaterialCommunityIcons name="phone-outline" size={18} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          onPress={() => open(`mailto:${GRIEVANCE_EMAIL}`)}
          accessibilityRole="button"
          accessibilityLabel={t("about_app.email_us")}
          style={({ pressed }) => [
            s.roundButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            pressed && s.pressed,
          ]}
        >
          <MaterialCommunityIcons name="email-outline" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>
    </InfoCard>
  );
}

const s = StyleSheet.create({
  note: { fontSize: 13, lineHeight: 19 },
  officer: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, padding: 10, marginTop: 14 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 14, fontWeight: "600" },
  rowText: { flex: 1, minWidth: 0 },
  rowLabel: { fontSize: 12 },
  rowValue: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.6 },
});
