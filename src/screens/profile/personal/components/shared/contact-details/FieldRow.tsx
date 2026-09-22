import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export type FieldRowProps = {
  label: string;
  value: string;
  editable?: boolean;
  sensitive?: boolean;
  verified?: boolean;
  unverified?: boolean;
  unmaskedValue?: string | null;
  isUnmasking?: boolean;
  onEdit?: () => void;
  onUnmask?: () => void;
  onMask?: () => void;
  onVerify?: () => void;
};

export default function FieldRow({
  label, value, editable, sensitive, verified, unverified,
  unmaskedValue, isUnmasking, onEdit, onUnmask, onMask, onVerify,
}: FieldRowProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const displayValue = unmaskedValue ?? value;
  const isRevealed = !!unmaskedValue;

  return (
    <View style={[s.row, { borderBottomColor: colors.divider }]}>
      <View style={s.text}>
        <Text style={[s.label, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[s.value, { color: colors.textPrimary }]}>{displayValue || "—"}</Text>
      </View>
      {isUnmasking ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : sensitive && !isRevealed ? (
        <Pressable onPress={onUnmask} hitSlop={10}>
          <MaterialCommunityIcons name="eye-outline" size={18} color={colors.accent} />
        </Pressable>
      ) : sensitive && isRevealed ? (
        <Pressable onPress={onMask} hitSlop={10}>
          <MaterialCommunityIcons name="eye-off-outline" size={18} color={colors.textMuted} />
        </Pressable>
      ) : verified ? (
        <View style={[s.badge, { backgroundColor: colors.successSoft }]}>
          <MaterialCommunityIcons name="check-circle" size={11} color={colors.success} />
          <Text style={[s.badgeText, { color: colors.success }]}>{t("personal.verified_badge")}</Text>
        </View>
      ) : unverified ? (
        <Pressable onPress={onVerify} hitSlop={8} style={[s.badge, { backgroundColor: colors.warningSoft }]}>
          <MaterialCommunityIcons name="clock-outline" size={11} color={colors.warning} />
          <Text style={[s.badgeText, { color: colors.warning }]}>{t("personal.verify_badge")}</Text>
        </Pressable>
      ) : editable ? (
        <Pressable onPress={onEdit} hitSlop={10}>
          <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, gap: 10,
  },
  text: { flex: 1 },
  label: { fontSize: 12, marginBottom: 2 },
  value: { fontSize: 15, fontWeight: "500" },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: "600" },
});
