import AvatarInitials from "@components/avatar-initials";
import { Logo } from "@assets/svgs";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LanguageSheet from "@components/language-sheet";
import ThemeSheet from "@components/theme-sheet";

/** Picks the greeting text + icon for the current time of day. */
function useGreeting() {
  const { t } = useTranslation();
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: t("home.greeting_morning"), icon: "weather-sunny", tint: "#F5A623" };
  if (h >= 12 && h < 17) return { text: t("home.greeting_afternoon"), icon: "weather-partly-cloudy", tint: "#F5A623" };
  if (h >= 17 && h < 21) return { text: t("home.greeting_evening"), icon: "weather-sunset", tint: "#E8763A" };
  return { text: t("home.greeting_night"), icon: "weather-night", tint: "#6C7BE0" };
}

type Props = {
  customerName: string;
};

/**
 * Home header: logo, time-of-day greeting with the customer's name, and
 * language / theme / profile actions — mirrors the Customer-App layout.
 */
export default function HomeHeader({ customerName }: Props) {
  const { colors, resolved } = useTheme();
  const navigation = useNavigation<any>();
  const greeting = useGreeting();

  const [langVisible, setLangVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);

  return (
    <View style={s.row}>
      <View style={[s.logo, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Logo size={22} />
      </View>

      <View style={s.textBlock}>
        <View style={s.greetingRow}>
          <Text style={[s.greeting, { color: colors.textSecondary }]} numberOfLines={1}>
            {greeting.text}
          </Text>
          <MaterialCommunityIcons name={greeting.icon as any} size={16} color={greeting.tint} />
        </View>
        <Text style={[s.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {customerName}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setLangVisible(true)}
        style={[s.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Change language"
      >
        <MaterialCommunityIcons name="translate" size={20} color={colors.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setThemeVisible(true)}
        style={[s.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Change theme"
      >
        <MaterialCommunityIcons
          name={resolved === "dark" ? "moon-waning-crescent" : "white-balance-sunny"}
          size={20}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("profile")}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        hitSlop={8}
      >
        <AvatarInitials name={customerName || "User"} size={38} fontSize={14} />
      </TouchableOpacity>

      <LanguageSheet visible={langVisible} onClose={() => setLangVisible(false)} />
      <ThemeSheet visible={themeVisible} onClose={() => setThemeVisible(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  textBlock: { flex: 1, marginLeft: 4 },
  greetingRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  greeting: { fontSize: 13, letterSpacing: 0.2 },
  name: { fontSize: 18, fontWeight: "700", marginTop: 1 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
