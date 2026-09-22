import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { DateRange, DateRangePickerProps } from "@data-types/date-range/constants";
import { getMonthsShort } from "@utils/format-locals";

const WEEK_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function DateRangePicker({ visible, initial, onClose, onApply }: DateRangePickerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [cursor, setCursor] = useState(() => (initial ? fromISO(initial.start) : new Date()));
  const [start, setStart] = useState<Date | null>(initial ? fromISO(initial.start) : null);
  const [end, setEnd] = useState<Date | null>(initial ? fromISO(initial.end) : null);

  useEffect(() => {
    if (visible) {
      setStart(initial ? fromISO(initial.start) : null);
      setEnd(initial ? fromISO(initial.end) : null);
      setCursor(initial ? fromISO(initial.start) : new Date());
    }
  }, [visible, initial]);

  const months = getMonthsShort();
  const monthLabel = `${months[cursor.getMonth()]} ${cursor.getFullYear()}`;

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [cursor]);

  const pick = (day: Date) => {
    if (!start || (start && end)) {
      setStart(day);
      setEnd(null);
      return;
    }
    if (day < start) {
      setEnd(start);
      setStart(day);
    } else {
      setEnd(day);
    }
  };

  const inRange = (day: Date) => start && end && day > start && day < end;

  const shiftMonth = (delta: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  const reset = () => {
    setStart(null);
    setEnd(null);
  };

  const apply = () => {
    if (!start) return;
    const range: DateRange = { start: toISO(start), end: toISO(end ?? start) };
    onApply(range);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[s.overlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable
          style={[s.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={s.header}>
            <Text style={[s.title, { color: colors.textPrimary }]}>{t("common.select_dates")}</Text>
            <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel={t("common.cancel")}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={s.monthNav}>
            <Pressable onPress={() => shiftMonth(-1)} hitSlop={8} accessibilityRole="button">
              <MaterialCommunityIcons name="chevron-left" size={24} color={colors.textPrimary} />
            </Pressable>
            <Text style={[s.monthLabel, { color: colors.textPrimary }]}>{monthLabel}</Text>
            <Pressable onPress={() => shiftMonth(1)} hitSlop={8} accessibilityRole="button">
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          <View style={s.weekRow}>
            {WEEK_LABELS.map((w, i) => (
              <Text key={i} style={[s.weekLabel, { color: colors.textMuted }]}>
                {w}
              </Text>
            ))}
          </View>

          <View style={s.grid}>
            {days.map((day, i) => {
              if (!day) return <View key={`e-${i}`} style={s.cell} />;
              const isStart = start && sameDay(day, start);
              const isEnd = end && sameDay(day, end);
              const edge = isStart || isEnd;
              const between = inRange(day);
              const hasRange = !!(start && end);
              const isToday = sameDay(day, new Date());

              // Continuous soft-accent track behind start → end (rounded on the ends).
              const trackStyle = hasRange && (between || edge) && {
                backgroundColor: colors.accent + "22",
                borderTopLeftRadius: isStart ? 999 : 0,
                borderBottomLeftRadius: isStart ? 999 : 0,
                borderTopRightRadius: isEnd ? 999 : 0,
                borderBottomRightRadius: isEnd ? 999 : 0,
              };

              return (
                <Pressable key={toISO(day)} onPress={() => pick(day)} style={s.cell} accessibilityRole="button">
                  <View style={[s.track, trackStyle]}>
                    <View
                      style={[
                        s.dayInner,
                        edge && { backgroundColor: colors.accent },
                        isToday && !edge && { borderWidth: 1, borderColor: colors.accent },
                      ]}
                    >
                      <Text
                        style={[
                          s.dayText,
                          { color: edge ? "#FFFFFF" : between ? colors.accent : colors.textPrimary },
                          (edge || isToday) && { fontWeight: "700" },
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={s.actions}>
            <PrimaryButton
              title={t("common.reset")}
              onPress={reset}
              variant="secondary"
              style={s.actionBtn}
            />
            <PrimaryButton
              title={t("common.apply")}
              onPress={apply}
              disabled={!start}
              style={s.actionBtn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    paddingBottom: 32,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  title: { fontSize: 16, fontWeight: "700" },
  monthNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  monthLabel: { fontSize: 15, fontWeight: "600" },
  weekRow: { flexDirection: "row", marginBottom: 6 },
  weekLabel: { flex: 1, textAlign: "center", fontSize: 12, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: `${100 / 7}%`, aspectRatio: 1 },
  track: { flex: 1, alignItems: "center", justifyContent: "center" },
  dayInner: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  dayText: { fontSize: 13, fontWeight: "500" },
  actions: { flexDirection: "row", gap: 12, marginTop: 16 },
  actionBtn: { flex: 1 },
});
