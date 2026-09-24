import { useTheme } from "@context/Theme/ThemeContext";
import { PrimaryButton } from "@helpers/button";
import BottomSheet from "@helpers/model";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { DateRangePickerProps } from "@data-types/date-range/constants";
import { getMonthsShort } from "@utils/format-locals";

const WEEK_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_MS = 86_400_000;
const CELL_H = 44;
const DISC = 38; // diameter of the day disc / range band height

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

type NavMode = "day" | "month" | "year";

export default function DateRangePicker({ visible, initial, onClose, onApply }: DateRangePickerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [cursor, setCursor] = useState(() => (initial ? fromISO(initial.start) : new Date()));
  const [start, setStart] = useState<Date | null>(initial ? fromISO(initial.start) : null);
  const [end, setEnd] = useState<Date | null>(initial ? fromISO(initial.end) : null);
  const [navMode, setNavMode] = useState<NavMode>("day");
  const [yearPageEnd, setYearPageEnd] = useState(() => new Date().getFullYear());

  useEffect(() => {
    if (visible) {
      const base = initial ? fromISO(initial.start) : new Date();
      setStart(initial ? fromISO(initial.start) : null);
      setEnd(initial ? fromISO(initial.end) : null);
      setCursor(base);
      setNavMode("day");
      setYearPageEnd(Math.min(new Date().getFullYear(), base.getFullYear() + 4));
    }
  }, [visible, initial]);

  const months = getMonthsShort();

  const now = new Date();
  const maxDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isFuture = (day: Date) => day.getTime() > maxDay.getTime();
  const atCurrentMonth =
    cursor.getFullYear() === now.getFullYear() && cursor.getMonth() === now.getMonth();

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
    if (isFuture(day)) return;
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

  const inRange = (day: Date) => !!(start && end && day > start && day < end);
  const shiftMonth = (delta: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  const reset = () => {
    setStart(null);
    setEnd(null);
  };
  const apply = () => {
    if (!start) return;
    onApply({ start: toISO(start), end: toISO(end ?? start) });
    onClose();
  };

  const selectedCount = useMemo(() => {
    if (!start) return 0;
    const a = start.getTime();
    const b = (end ?? start).getTime();
    return Math.round(Math.abs(b - a) / DAY_MS) + 1;
  }, [start, end]);

  const summaryText = useMemo(() => {
    if (!start) return t("common.select_dates");
    const fmt = (d: Date) => `${d.getDate()} ${months[d.getMonth()]}`;
    if (!end || sameDay(start, end)) return fmt(start);
    return `${fmt(start)} → ${fmt(end)}`;
  }, [start, end, months, t]);

  const MIN_YEAR = 1950;
  const maxYear = now.getFullYear();
  const pageEnd = Math.min(yearPageEnd, maxYear);
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = pageEnd; y > pageEnd - 12 && y >= MIN_YEAR; y--) arr.push(y);
    return arr.reverse();
  }, [pageEnd]);
  const canPageOlder = pageEnd - 12 >= MIN_YEAR;
  const canPageNewer = pageEnd < maxYear;

  const footer = (
    <View>
      <View style={[s.summaryCard, { backgroundColor: colors.surface }]}>
        <View style={s.summaryLeft}>
          <MaterialCommunityIcons name="calendar-range" size={18} color={colors.accent} />
          <Text style={[s.summaryText, { color: colors.textPrimary }]} numberOfLines={1}>
            {summaryText}
          </Text>
        </View>
        {selectedCount > 0 ? (
          <View style={[s.countPill, { backgroundColor: colors.accent }]}>
            <Text style={s.countText}>{t("common.days_selected", { count: selectedCount })}</Text>
          </View>
        ) : null}
      </View>
      <View style={s.actions}>
        <PrimaryButton title={t("common.reset")} onPress={reset} variant="secondary" style={s.actionBtn} />
        <PrimaryButton title={t("common.apply")} onPress={apply} disabled={!start} style={s.actionBtn} />
      </View>
    </View>
  );

  // ── Header: month + year as two tappable segments, with month arrows ──
  const renderHeader = () => (
    <View style={s.header}>
      <Pressable
        onPress={() => navMode === "day" && shiftMonth(-1)}
        disabled={navMode !== "day"}
        hitSlop={10}
        accessibilityRole="button"
        style={[s.arrow, { backgroundColor: colors.surface, opacity: navMode === "day" ? 1 : 0 }]}
      >
        <MaterialCommunityIcons name="chevron-left" size={22} color={colors.textPrimary} />
      </Pressable>

      <View style={s.headerCenter}>
        <Pressable
          onPress={() => setNavMode((m) => (m === "month" ? "day" : "month"))}
          style={[
            s.headerChip,
            { backgroundColor: navMode === "month" ? colors.accent : colors.surface },
          ]}
          accessibilityRole="button"
        >
          <Text style={[s.headerChipText, { color: navMode === "month" ? "#fff" : colors.textPrimary }]}>
            {months[cursor.getMonth()]}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setNavMode((m) => (m === "year" ? "day" : "year"))}
          style={[
            s.headerChip,
            { backgroundColor: navMode === "year" ? colors.accent : colors.surface },
          ]}
          accessibilityRole="button"
        >
          <Text style={[s.headerChipText, { color: navMode === "year" ? "#fff" : colors.textPrimary }]}>
            {cursor.getFullYear()}
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => navMode === "day" && !atCurrentMonth && shiftMonth(1)}
        disabled={navMode !== "day" || atCurrentMonth}
        hitSlop={10}
        accessibilityRole="button"
        style={[
          s.arrow,
          { backgroundColor: colors.surface, opacity: navMode === "day" && !atCurrentMonth ? 1 : 0.3 },
        ]}
      >
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textPrimary} />
      </Pressable>
    </View>
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("common.select_dates")} footer={footer}>
      {renderHeader()}

      {navMode === "day" ? (
        <>
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
              const isStart = !!(start && sameDay(day, start));
              const isEnd = !!(end && sameDay(day, end));
              const edge = isStart || isEnd;
              const between = inRange(day);
              const hasRange = !!(start && end && !sameDay(start, end));
              const isToday = sameDay(day, now);
              const disabled = isFuture(day);
              const showBand = hasRange && (between || edge);

              // How the soft range band fills this cell:
              //  - middle day: full width, square edges (meets neighbours)
              //  - start of range: right half only, rounded on the left cap
              //  - end of range: left half only, rounded on the right cap
              const bandFill = colors.accent + "22";

              return (
                <Pressable
                  key={toISO(day)}
                  onPress={() => pick(day)}
                  disabled={disabled}
                  style={s.cell}
                  accessibilityRole="button"
                  accessibilityState={{ disabled, selected: edge }}
                >
                  {showBand ? (
                    <View style={s.bandLayer} pointerEvents="none">
                      {between ? (
                        <View style={[s.bandFull, { backgroundColor: bandFill }]} />
                      ) : isStart && isEnd ? null : isStart ? (
                        <View style={[s.bandHalfRight, { backgroundColor: bandFill }]} />
                      ) : (
                        <View style={[s.bandHalfLeft, { backgroundColor: bandFill }]} />
                      )}
                    </View>
                  ) : null}

                  {/* Perfectly circular disc for every selected/edge/today day */}
                  <View
                    style={[
                      s.disc,
                      edge && { backgroundColor: colors.accent },
                      isToday && !edge && { borderWidth: 1.5, borderColor: colors.accent },
                    ]}
                  >
                    <Text
                      style={[
                        s.dayText,
                        {
                          color: disabled
                            ? colors.disabled
                            : edge
                              ? "#FFFFFF"
                              : between
                                ? colors.accent
                                : colors.textPrimary,
                        },
                        (edge || isToday) && { fontWeight: "700" },
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : navMode === "month" ? (
        <>
          <Text style={[s.pickerHint, { color: colors.textMuted }]}>
            {t("common.pick_month")}
          </Text>
          <View style={s.optionGrid}>
            {months.map((m, idx) => {
              const isFutureMonth =
                cursor.getFullYear() > now.getFullYear() ||
                (cursor.getFullYear() === now.getFullYear() && idx > now.getMonth());
              const active = idx === cursor.getMonth();
              return (
                <Pressable
                  key={m}
                  disabled={isFutureMonth}
                  onPress={() => {
                    setCursor(new Date(cursor.getFullYear(), idx, 1));
                    setNavMode("day");
                  }}
                  style={[
                    s.optionCell,
                    {
                      backgroundColor: active ? colors.accent : colors.surface,
                      borderColor: active ? colors.accent : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.optionText,
                      {
                        color: isFutureMonth ? colors.disabled : active ? "#fff" : colors.textPrimary,
                        fontWeight: active ? "700" : "500",
                      },
                    ]}
                  >
                    {m}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <View style={s.yearPager}>
            <Pressable
              onPress={() => canPageOlder && setYearPageEnd((p) => p - 12)}
              disabled={!canPageOlder}
              hitSlop={10}
              accessibilityRole="button"
              style={[s.arrow, { backgroundColor: colors.surface, opacity: canPageOlder ? 1 : 0.3 }]}
            >
              <MaterialCommunityIcons name="chevron-left" size={22} color={colors.textPrimary} />
            </Pressable>
            <Text style={[s.yearRangeText, { color: colors.textSecondary }]}>
              {years[0]} – {years[years.length - 1]}
            </Text>
            <Pressable
              onPress={() => canPageNewer && setYearPageEnd((p) => Math.min(maxYear, p + 12))}
              disabled={!canPageNewer}
              hitSlop={10}
              accessibilityRole="button"
              style={[s.arrow, { backgroundColor: colors.surface, opacity: canPageNewer ? 1 : 0.3 }]}
            >
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>

          <View style={s.optionGrid}>
            {years.map((y) => {
              const active = y === cursor.getFullYear();
              return (
                <Pressable
                  key={y}
                  onPress={() => {
                    setCursor(new Date(y, cursor.getMonth(), 1));
                    setNavMode("month");
                  }}
                  style={[
                    s.optionCell,
                    {
                      backgroundColor: active ? colors.accent : colors.surface,
                      borderColor: active ? colors.accent : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.optionText,
                      { color: active ? "#fff" : colors.textPrimary, fontWeight: active ? "700" : "500" },
                    ]}
                  >
                    {y}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  // Header
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  headerChipText: { fontSize: 15, fontWeight: "700" },
  arrow: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },

  // Day grid
  weekRow: { flexDirection: "row", marginBottom: 4 },
  weekLabel: { flex: 1, textAlign: "center", fontSize: 12, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: `${100 / 7}%`, height: CELL_H, alignItems: "center", justifyContent: "center" },
  // Band layer spans the full cell and is vertically centered to the disc.
  bandLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: (CELL_H - DISC) / 2,
    height: DISC,
  },
  bandFull: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
  // Start day: soft band fills from the cell centre to the right edge.
  bandHalfRight: { position: "absolute", top: 0, bottom: 0, left: "50%", right: 0 },
  // End day: soft band fills from the left edge to the cell centre.
  bandHalfLeft: { position: "absolute", top: 0, bottom: 0, left: 0, right: "50%" },
  disc: { width: DISC, height: DISC, borderRadius: DISC / 2, alignItems: "center", justifyContent: "center" },
  dayText: { fontSize: 14, fontWeight: "500" },

  // Month / Year option grids — gap-based, 3 per row, no negative margins.
  pickerHint: { fontSize: 12, textAlign: "center", marginBottom: 12 },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optionCell: {
    width: "31.5%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: { fontSize: 15 },

  yearPager: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  yearRangeText: { fontSize: 15, fontWeight: "700" },

  // Footer
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  summaryLeft: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 },
  summaryText: { fontSize: 14, fontWeight: "700", flexShrink: 1 },
  countPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  countText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1 },
});
