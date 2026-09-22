/**
 * BankDetailsRow
 *
 * Reusable display component for a bank account field row.
 * Used in company screen (banking section) and future personal banking screens.
 */
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  bankName: string;
  last4: string;
  ifsc: string;
  verified?: boolean;
};

export default function BankDetailsRow({ bankName, last4, ifsc, verified }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[s.wrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[s.row, { borderBottomColor: colors.divider }]}>
        <View style={s.text}>
          <Text style={[s.label, { color: colors.textMuted }]}>Bank account</Text>
          <Text style={[s.value, { color: colors.textPrimary }]}>{bankName} •••• {last4}</Text>
        </View>
        {verified && (
          <View style={[s.badge, { backgroundColor: colors.successSoft }]}>
            <MaterialCommunityIcons name="check-circle" size={11} color={colors.success} />
            <Text style={[s.badgeText, { color: colors.success }]}>Verified</Text>
          </View>
        )}
      </View>
      <View style={[s.row, { borderBottomColor: colors.divider }]}>
        <View style={s.text}>
          <Text style={[s.label, { color: colors.textMuted }]}>IFSC</Text>
          <Text style={[s.value, { color: colors.textPrimary }]}>{ifsc}</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, overflow: "hidden", marginBottom: 20 },
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
