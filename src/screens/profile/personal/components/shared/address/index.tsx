import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatAddress } from "@utils/format-locals";

type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

type Props = {
  address: Address;
  editable?: boolean;
  onEdit?: () => void;
};

export default function AddressRow({ address, editable, onEdit }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[s.row, { borderBottomColor: colors.divider }]}>
      <View style={s.text}>
        <Text style={[s.label, { color: colors.textMuted }]}>Residential address</Text>
        <Text style={[s.value, { color: colors.textPrimary }]}>{formatAddress(address)}</Text>
      </View>
      {editable && (
        <Pressable onPress={onEdit} hitSlop={10}>
          <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

export { formatAddress } from "@utils/format-locals";

const s = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, gap: 10,
  },
  text: { flex: 1 },
  label: { fontSize: 12, marginBottom: 2 },
  value: { fontSize: 15, fontWeight: "500" },
});
