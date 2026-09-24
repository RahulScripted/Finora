import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export type DropdownOption<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  options: DropdownOption<T>[];
  value: T;
  /** Text shown on the trigger (e.g. a custom range label). Falls back to the selected option label. */
  triggerLabel?: string;
  onChange: (value: T) => void;
};

/** Compact dropdown selector. Opens a small menu anchored under the trigger. */
export default function PeriodDropdown<T extends string>({
  options,
  value,
  triggerLabel,
  onChange,
}: Props<T>) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.key === value);
  const label = triggerLabel ?? selected?.label ?? "";

  const choose = (key: T) => {
    setOpen(false);
    onChange(key);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          s.trigger,
          { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={[s.triggerText, { color: colors.textPrimary }]} numberOfLines={1}>
          {label}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={16} color={colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.overlay} onPress={() => setOpen(false)}>
          <Pressable
            style={[s.menu, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            {options.map((opt, i) => {
              const active = opt.key === value;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => choose(opt.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    s.row,
                    i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
                    pressed && { backgroundColor: colors.surface },
                  ]}
                >
                  <Text
                    style={[
                      s.rowText,
                      { color: active ? colors.accent : colors.textPrimary, fontWeight: active ? "700" : "500" },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {active ? (
                    <MaterialCommunityIcons name="check" size={16} color={colors.accent} />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 170,
  },
  triggerText: { fontSize: 12, fontWeight: "600" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.15)", alignItems: "flex-end", paddingTop: 220, paddingHorizontal: 20 },
  menu: { minWidth: 180, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13 },
  rowText: { fontSize: 14 },
});
