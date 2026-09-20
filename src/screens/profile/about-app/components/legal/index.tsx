import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";
import { LEGAL_ROWS } from "@data-types/about/constants";
import InfoCard from "../shared/info-card";

/** List of legal policy links that navigate to their respective screens. */
export default function LegalLinks() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <InfoCard>
      {LEGAL_ROWS.map((row, i) => (
        <Pressable
          key={row.key}
          onPress={() => navigation.navigate(row.route)}
          accessibilityRole="button"
          style={({ pressed }) => [
            s.row,
            i < LEGAL_ROWS.length - 1 && {
              borderBottomColor: colors.divider,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
            pressed && s.pressed,
          ]}
        >
          <Text style={[s.label, { color: colors.textPrimary }]}>{t(`about_app.${row.key}`)}</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
        </Pressable>
      ))}
    </InfoCard>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 14,
  },
  label: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  pressed: { opacity: 0.6 },
});
