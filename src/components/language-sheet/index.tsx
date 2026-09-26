import BottomSheet from "@helpers/model";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { changeLanguage, SUPPORTED_LANGUAGES, type LanguageCode } from "@context/language";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type Props = { visible: boolean; onClose: () => void };

/** Bottom sheet to pick the app language. Persists the choice. */
export default function LanguageSheet({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();

  const handleSelect = async (code: LanguageCode) => {
    if (code !== i18n.language) await changeLanguage(code);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("common.choose_language")}>
      <View style={s.list}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const active = lang.code === i18n.language;
          return (
            <Pressable
              key={lang.code}
              onPress={() => handleSelect(lang.code)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={[
                s.row,
                {
                  backgroundColor: active ? colors.accent + "12" : colors.surface,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text style={[s.label, { color: colors.textPrimary }]}>{lang.label}</Text>
              {active ? (
                <MaterialCommunityIcons name="check-circle" size={20} color={colors.accent} />
              ) : (
                <MaterialCommunityIcons name="circle-outline" size={20} color={colors.textMuted} />
              )}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  list: { gap: 10, paddingBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 15, fontWeight: "600" },
});
