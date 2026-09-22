/**
 * DocumentRow
 *
 * Reusable display row for a single document entry.
 * Used in profile/documents screen and future KYC document upload flows.
 */
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Status = "uploaded" | "pending" | "rejected";

type Props = {
  label: string;
  status: Status;
  onView?: () => void;
};

const STATUS_CONFIG: Record<Status, { icon: string; color: keyof any; label: string }> = {
  uploaded: { icon: "check-circle-outline", color: "success", label: "Uploaded" },
  pending: { icon: "clock-outline", color: "warning", label: "Pending" },
  rejected: { icon: "close-circle-outline", color: "danger", label: "Rejected" },
};

export default function DocumentRow({ label, status, onView }: Props) {
  const { colors } = useTheme();
  const cfg = STATUS_CONFIG[status];
  const iconColor = (colors as any)[cfg.color];

  return (
    <View style={[s.row, { borderBottomColor: colors.divider }]}>
      <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.textSecondary} />
      <View style={s.text}>
        <Text style={[s.label, { color: colors.textPrimary }]}>{label}</Text>
        <View style={s.statusRow}>
          <MaterialCommunityIcons name={cfg.icon as any} size={12} color={iconColor} />
          <Text style={[s.statusText, { color: iconColor }]}>{cfg.label}</Text>
        </View>
      </View>
      {onView && (
        <Pressable onPress={onView} hitSlop={8}>
          <Text style={[s.viewBtn, { color: colors.accent }]}>View</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1 },
  label: { fontSize: 14, fontWeight: "500" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  statusText: { fontSize: 11 },
  viewBtn: { fontSize: 13, fontWeight: "600" },
});
