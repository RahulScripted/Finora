import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  initials: string;
  displayName: string;
  kycStatus: string;
  avatarUri: string | null;
  onPressAvatar: () => void;
};

export default function Hero({ initials, displayName, kycStatus, avatarUri, onPressAvatar }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const verified = kycStatus === "verified";

  return (
    <View style={s.hero}>
      <Pressable onPress={onPressAvatar} style={s.avatarWrap}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={s.avatarImg} contentFit="cover" />
        ) : (
          <View style={[s.avatarFallback, { backgroundColor: colors.accent }]}>
            <Text style={s.avatarInitials}>{initials}</Text>
          </View>
        )}
        <View style={[s.cameraBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="camera-outline" size={13} color={colors.textSecondary} />
        </View>
      </Pressable>
      <Text style={[s.name, { color: colors.textPrimary }]}>{displayName}</Text>
      <View style={[s.kyc, { backgroundColor: verified ? colors.successSoft : colors.warningSoft }]}>
        <MaterialCommunityIcons
          name={verified ? "check-circle" : "clock-outline"}
          size={13}
          color={verified ? colors.success : colors.warning}
        />
        <Text style={[s.kycText, { color: verified ? colors.success : colors.warning }]}>
          {verified ? t("personal.kyc_verified") : t("personal.kyc_pending")}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: "center", paddingVertical: 24, gap: 8 },
  avatarWrap: { position: "relative" },
  avatarFallback: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  avatarImg: { width: 80, height: 80, borderRadius: 40 },
  avatarInitials: { color: "#fff", fontSize: 28, fontWeight: "700" },
  cameraBtn: {
    position: "absolute", bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  name: { fontSize: 18, fontWeight: "700" },
  kyc: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  kycText: { fontSize: 12, fontWeight: "600" },
});
