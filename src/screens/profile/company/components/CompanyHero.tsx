import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  displayName: string;
  businessType: string;
  yearEstablished: number;
};

export default function CompanyHero({ displayName, businessType, yearEstablished }: Props) {
  const { colors } = useTheme();
  return (
    <View style={s.hero}>
      <View style={[s.logoWrap, { backgroundColor: colors.accent + "18", borderColor: colors.border }]}>
        <MaterialCommunityIcons name="storefront-outline" size={32} color={colors.accent} />
      </View>
      <Text style={[s.name, { color: colors.textPrimary }]}>{displayName}</Text>
      <Text style={[s.sub, { color: colors.textSecondary }]}>
        {businessType} | Est. {yearEstablished}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: "center", paddingVertical: 24, gap: 6 },
  logoWrap: {
    width: 72, height: 72, borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  name: { fontSize: 18, fontWeight: "700" },
  sub: { fontSize: 13 },
});
