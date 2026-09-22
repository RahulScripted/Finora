import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "@helpers/model";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickGallery: () => void;
};

export default function AvatarPickerSheet({ visible, onClose, onPickCamera, onPickGallery }: Props) {
  const { colors } = useTheme();

  // Close sheet fully before launching native camera/gallery
  const handleCamera = () => { onClose(); setTimeout(onPickCamera, 600); };
  const handleGallery = () => { onClose(); setTimeout(onPickGallery, 600); };

  const options = [
    { icon: "camera-outline" as const, label: "Camera", action: handleCamera },
    { icon: "image-outline" as const, label: "Gallery", action: handleGallery },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Update photo">
      <View style={s.list}>
        {options.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[s.row, { borderBottomColor: colors.divider }]}
            activeOpacity={0.7}
            onPress={item.action}
          >
            <View style={[s.icon, { backgroundColor: colors.surface }]}>
              <MaterialCommunityIcons name={item.icon} size={22} color={colors.textPrimary} />
            </View>
            <Text style={[s.label, { color: colors.textPrimary }]}>{item.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  list: { gap: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, fontSize: 15 },
});
