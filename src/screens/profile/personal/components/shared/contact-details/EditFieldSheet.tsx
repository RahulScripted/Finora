import { useTheme } from "@context/Theme/ThemeContext";
import { PrimaryButton } from "@helpers/button";
import BottomSheet from "@helpers/model";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  visible: boolean;
  onSave: (v: string) => void;
  onClose: () => void;
};

export default function EditFieldSheet({ label, value, visible, onSave, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [draft, setDraft] = useState(value);

  return (
    <BottomSheet visible={visible} onClose={onClose} title={label}>
      <View style={s.wrap}>
        <TextInput
          style={[s.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border }]}
          value={draft}
          onChangeText={setDraft}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => onSave(draft)}
        />
        <PrimaryButton title={t("personal.save")} onPress={() => onSave(draft)} />
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 16, paddingBottom: 8 },
  input: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15 },
});
