import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type Props = {
  onPress: () => void;
};

/** "Need help?" support prompt that opens the support screen. */
export default function NeedHelp({ onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[s.iconWrap, { backgroundColor: colors.accent + "1F" }]}>
        <MaterialCommunityIcons name="headset" size={22} color={colors.accent} />
      </View>

      <View style={s.body}>
        <Text style={[s.title, { color: colors.textPrimary }]}>{t("offers.need_help.title")}</Text>
        <Text style={[s.sub, { color: colors.textSecondary }]}>{t("offers.need_help.subtitle")}</Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 2 },
  title: { fontSize: 14.5, fontWeight: "700" },
  sub: { fontSize: 12.5, lineHeight: 18 },
});
