import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "@helpers/model";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPickFile: () => void;
};

/** Bottom-sheet with a single "Files" option (no camera), used for attachments. */
export default function FilePickerSheet({ visible, onClose, onPickFile }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Close the sheet fully before launching the native picker.
  const handleFiles = () => {
    onClose();
    setTimeout(onPickFile, 600);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("support.attach_file")}>
      <View style={s.list}>
        <TouchableOpacity
          style={[s.row, { borderBottomColor: colors.divider }]}
          activeOpacity={0.7}
          onPress={handleFiles}
          accessibilityRole="button"
        >
          <View style={[s.icon, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="folder-outline" size={22} color={colors.textPrimary} />
          </View>
          <View style={s.textCol}>
            <Text style={[s.label, { color: colors.textPrimary }]}>
              {t("support.choose_from_files")}
            </Text>
            <Text style={[s.sub, { color: colors.textMuted }]}>
              {t("support.choose_from_files_sub")}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  list: { gap: 2, paddingBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  textCol: { flex: 1 },
  label: { fontSize: 15, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 2 },
});
