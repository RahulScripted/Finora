import BottomSheet from "@helpers/model";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TXN_FILTERS, type TxnFilter } from "@data-types/transaction-history/constants";

type Props = {
  visible: boolean;
  onClose: () => void;
  active: TxnFilter;
  onSelect: (filter: TxnFilter) => void;
};

/** Bottom sheet mirroring the filter pills, opened from the search bar. */
export default function FilterSheet({ visible, onClose, active, onSelect }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const select = (filter: TxnFilter) => {
    onSelect(filter);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("transaction_history.filter_by")}>
      <View style={s.list}>
        {TXN_FILTERS.map((filter) => {
          const selected = filter === active;
          return (
            <Pressable
              key={filter}
              onPress={() => select(filter)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={s.row}
            >
              <Text
                style={[
                  s.label,
                  { color: selected ? colors.accent : colors.textPrimary },
                  selected && s.labelActive,
                ]}
              >
                {t(`transaction_history.filters.${filter}`)}
              </Text>
              <MaterialCommunityIcons
                name={selected ? "check-circle" : "circle-outline"}
                size={20}
                color={selected ? colors.accent : colors.textMuted}
              />
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
    paddingHorizontal: 4,
    paddingVertical: 15,
  },
  label: { fontSize: 15, fontWeight: "600" },
  labelActive: { fontWeight: "700" },
});
