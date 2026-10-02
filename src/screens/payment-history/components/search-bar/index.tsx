import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  /** Opens the filter sheet. Shows an active dot when a filter is applied. */
  onFilterPress: () => void;
  filterActive?: boolean;
};

/** Search field with a leading icon and a trailing clear + filter affordance. */
export default function SearchBar({ value, onChange, onFilterPress, filterActive }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[s.wrap, { backgroundColor: colors.card }]}>
      <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t("transaction_history.search_placeholder")}
        placeholderTextColor={colors.placeholder}
        style={[s.input, { color: colors.textPrimary }]}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChange("")}
          accessibilityRole="button"
          accessibilityLabel={t("common.reset")}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
      <Pressable
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel={t("transaction_history.filter")}
        hitSlop={8}
        style={({ pressed }) => [s.filterBtn, pressed && s.pressed]}
      >
        <MaterialCommunityIcons
          name="tune-variant"
          size={18}
          color={filterActive ? colors.accent : colors.textMuted}
        />
        {filterActive ? <View style={[s.dot, { backgroundColor: colors.accent }]} /> : null}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  input: { flex: 1, fontSize: 14, padding: 0 },
  filterBtn: { padding: 2 },
  pressed: { opacity: 0.6 },
  dot: { position: "absolute", top: 0, right: 0, width: 7, height: 7, borderRadius: 4 },
});
