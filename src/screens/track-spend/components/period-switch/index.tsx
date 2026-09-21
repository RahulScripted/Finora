import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PERIODS, type Period } from "@data-types/track-spend/constants";

type Props = {
  value: Period;
  onChange: (p: Period) => void;
  /** Label for the active custom range, or null when no custom range is set. */
  customLabel?: string | null;
  onOpenCustom: () => void;
};

/** Colored segmented tabs (active tab filled with accent) + a custom-range trigger. */
export default function PeriodSwitch({ value, onChange, customLabel, onOpenCustom }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const customActive = !!customLabel;

  return (
    <View style={s.wrap}>
      <View style={[s.track, { backgroundColor: colors.surface }]} accessibilityRole="tablist">
        {PERIODS.map((p) => {
          const selected = !customActive && p === value;
          return (
            <Pressable
              key={p}
              onPress={() => onChange(p)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[s.item, selected && { backgroundColor: colors.accent }]}
            >
              <Text
                style={[
                  s.text,
                  { color: selected ? "#FFFFFF" : colors.textSecondary, fontWeight: selected ? "700" : "500" },
                ]}
              >
                {t(`track_spend.period_${p}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={onOpenCustom}
        accessibilityRole="button"
        accessibilityLabel={t("common.custom_range")}
        style={[
          s.custom,
          {
            backgroundColor: customActive ? colors.accent : colors.surface,
            borderColor: customActive ? colors.accent : colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="calendar-range"
          size={16}
          color={customActive ? "#FFFFFF" : colors.textSecondary}
        />
        {customActive ? (
          <Text style={[s.customText, { color: "#FFFFFF" }]} numberOfLines={1}>
            {customLabel}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  track: { flex: 1, flexDirection: "row", borderRadius: 12, padding: 3 },
  item: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 9 },
  text: { fontSize: 12 },
  custom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 150,
  },
  customText: { fontSize: 12, fontWeight: "700" },
});
