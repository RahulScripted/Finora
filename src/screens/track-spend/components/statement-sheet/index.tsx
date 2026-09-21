import DateRangePicker from "@components/date-range-picker";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import BottomSheet from "@helpers/model";
import { useLoadingAction } from "@hooks/useLoadingAction";
import { fireNotification, getDownloadNotification } from "@shared/notifications";
import type { DateRange } from "@data-types/date-range/constants";
import { formatShortDate } from "@utils/format-locals";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, Text, ToastAndroid } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onDownload: (selection: StatementSelection) => void;
};

export type StatementSelection = {
  type: "1m" | "3m" | "6m" | "1y" | "custom";
  range?: DateRange;
};

type PresetKey = "1m" | "3m" | "6m" | "1y";
const PRESETS: { key: PresetKey; labelKey: string }[] = [
  { key: "1m", labelKey: "track_spend.range_1m" },
  { key: "3m", labelKey: "track_spend.range_3m" },
  { key: "6m", labelKey: "track_spend.range_6m" },
  { key: "1y", labelKey: "track_spend.range_1y" },
];

export default function StatementSheet({ visible, onClose, onDownload }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selected, setSelected] = useState<PresetKey | "custom">("1m");
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const runWithLoader = useLoadingAction();

  const customLabel = customRange
    ? `${formatShortDate(customRange.start)} – ${formatShortDate(customRange.end)}`
    : t("track_spend.range_custom");

  const isCustomInvalid = selected === "custom" && !customRange;

  const handleDownload = () => {
    if (isCustomInvalid) return;
    if (selected === "custom" && customRange) {
      onDownload({ type: "custom", range: customRange });
    } else {
      onDownload({ type: selected as PresetKey });
    }

    setDownloading(true);

    setTimeout(() => {
      onClose();
      setDownloading(false);
    }, 800);

    runWithLoader({
      message: t("track_spend.downloading"),
      duration: 3500,
      onDone: () => {
        if (Platform.OS === "android") {
          ToastAndroid.show(t("track_spend.download_complete"), ToastAndroid.SHORT);
        }
        const tpl = getDownloadNotification();
        fireNotification({
          id: `stmt_dl_${Date.now()}`,
          type: "DOWNLOAD_COMPLETE",
          channel: "transactions",
          title: tpl.title,
          body: tpl.body,
          data: {},
          timestamp: new Date().toISOString(),
          priority: "default",
        }).catch(() => {});
      },
    });
  };

  return (
    <>
      <BottomSheet
        visible={visible}
        onClose={onClose}
        title={t("track_spend.statement_title")}
        footer={
          <PrimaryButton
            title={t("track_spend.download")}
            loadingLabel={t("track_spend.downloading")}
            loading={downloading}
            disabled={isCustomInvalid}
            onPress={handleDownload}
            leftAccessory={
              !downloading ? (
                <MaterialCommunityIcons name="download-outline" size={18} color="#FFFFFF" />
              ) : null
            }
          />
        }
      >
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>
          {t("track_spend.statement_subtitle")}
        </Text>

        {PRESETS.map((p) => (
          <SelectRow
            key={p.key}
            active={selected === p.key}
            icon="calendar-outline"
            label={t(p.labelKey)}
            onPress={() => setSelected(p.key)}
          />
        ))}

        <SelectRow
          active={selected === "custom"}
          icon="calendar-range"
          label={customLabel}
          onPress={() => {
            setSelected("custom");
            setPickerOpen(true);
          }}
        />
      </BottomSheet>

      <DateRangePicker
        visible={pickerOpen}
        initial={customRange}
        onClose={() => setPickerOpen(false)}
        onApply={(r) => {
          setCustomRange(r);
          setSelected("custom");
        }}
      />
    </>
  );
}

type RowProps = {
  active: boolean;
  icon: string;
  label: string;
  onPress: () => void;
};

function SelectRow({ active, icon, label, onPress }: RowProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={[
        s.row,
        {
          borderColor: active ? colors.accent : colors.border,
          backgroundColor: active ? colors.accent + "12" : "transparent",
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={20}
        color={active ? colors.accent : colors.textSecondary}
      />
      <Text style={[s.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
      <MaterialCommunityIcons
        name={active ? "radiobox-marked" : "radiobox-blank"}
        size={20}
        color={active ? colors.accent : colors.textMuted}
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  subtitle: { fontSize: 13, marginBottom: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: "600" },
});
