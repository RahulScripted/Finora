import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "@helpers/model";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type PickerItem = { key: string; label: string };

type Props = {
  visible: boolean;
  title: string;
  items: PickerItem[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onClose: () => void;
};

/** A bottom-sheet list picker used for category / sub-category selection. */
export default function PickerSheet({ visible, title, items, selectedKey, onSelect, onClose }: Props) {
  const { colors } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={s.list}>
        {items.map((item) => {
          const active = item.key === selectedKey;
          return (
            <TouchableOpacity
              key={item.key}
              style={[s.option, active && { backgroundColor: colors.accent + "18" }]}
              onPress={() => {
                onSelect(item.key);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[s.optionText, { color: colors.textPrimary }]}>{item.label}</Text>
              {active ? (
                <MaterialCommunityIcons name="check" size={18} color={colors.accent} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  list: { gap: 4, paddingBottom: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  optionText: { fontSize: 14, flex: 1 },
});
