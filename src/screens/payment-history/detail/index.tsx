import { AnimatedTick } from "@assets/svgs";
import { ConfettiOverlay } from "@components/confetti";
import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import { playSuccess } from "@helpers/sounds";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from "react-native";
import Animated, { Easing, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useTransactions } from "@hooks/useTransactions";
import { formatINR } from "@utils/format-locals";
import { maskAccount } from "@utils/transaction";
import TicketStyleCard from "@shared/ticket-card";
import { fireNotification } from "@shared/notifications";
import { useNotifications } from "@context/Notifications/NotificationContext";
import { useScrollToTop } from "@shared/scroll-to-top";

function formatStamp(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  let h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${dd}/${mm}/${d.getFullYear()} ${String(h).padStart(2, "0")}:${min}:${sec} ${ampm}`;
}

/** A label/value line inside the ticket. Optionally shows a copy icon. */
function InfoLine({
  label,
  value,
  valueColor,
  strong,
  copyable,
}: {
  label: string;
  value: string;
  valueColor?: string;
  strong?: boolean;
  copyable?: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={s.line}>
      <Text style={[s.lineLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={s.lineRight}>
        <Text
          style={[s.lineValue, { color: valueColor ?? colors.textPrimary }, strong && s.lineValueStrong]}
          numberOfLines={1}
        >
          {value}
        </Text>
        {copyable ? (
          <Pressable
            onPress={copy}
            accessibilityRole="button"
            accessibilityLabel={`${t("transaction_history.copy")} ${label}`}
            hitSlop={10}
            style={({ pressed }) => pressed && s.pressed}
          >
            <MaterialCommunityIcons
              name={copied ? "check" : "content-copy"}
              size={15}
              color={copied ? colors.success : colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/** Transaction Details — a ticket-style receipt reusing the shared ticket card. */
export default function TransactionDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getTransaction } = useTransactions();
  const { refreshInbox } = useNotifications();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const id: string | undefined = route.params?.id;
  const txn = id ? getTransaction(id) : undefined;

  const credit = txn?.direction === "credit";
  const [downloading, setDownloading] = useState(false);

  // Celebrate successful credits — play a chime once the screen mounts.
  useEffect(() => {
    if (credit && txn?.status === "credited") playSuccess();
  }, [credit, txn?.status]);

  // Download the receipt and surface a real notification (inbox + system
  // banner + sound), mirroring the Customer-App document download flow —
  // not a transient toast.
  const handleDownloadReceipt = async () => {
    if (downloading) return;
    setDownloading(true);
    const title = t("transaction_history.receipt_downloaded_title");
    const body = t("transaction_history.receipt_downloaded_body", { reference: txn?.reference ?? "" });
    const savedMsg = t("transaction_history.saved_to_downloads", {
      name: t("transaction_history.receipt"),
    });
    try {
      // Simulated file generation; swap for a real file write when wired.
      await new Promise((r) => setTimeout(r, 900));

      // Native toast confirmation (same pattern as the Customer-App download).
      // Android uses the OS toast; iOS gets an equivalent bottom pill toast.
      if (Platform.OS === "android") {
        ToastAndroid.show(savedMsg, ToastAndroid.SHORT);
      } else {
        Toast.show({ type: "pill", text1: savedMsg, position: "bottom", visibilityTime: 2500 });
      }

      await fireNotification({
        id: `receipt_${txn?.id ?? "txn"}_${Date.now()}`,
        type: "DOWNLOAD_COMPLETE",
        channel: "transactions",
        title,
        body,
        data: { reference: txn?.reference ?? "" },
        priority: "default",
        timestamp: new Date().toISOString(),
        screen: "payment-history",
      });
      // Refresh the in-memory inbox so the notification shows immediately
      // (the system listener only fires in dev/prod builds, not Expo Go).
      await refreshInbox();
    } finally {
      setDownloading(false);
    }
  };

  if (!txn) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("transaction_history.detail_title")} />
        <View style={s.empty}>
          <MaterialCommunityIcons name="file-search-outline" size={40} color={colors.textMuted} />
          <Text style={[s.emptyText, { color: colors.textSecondary }]}>
            {t("transaction_history.not_found")}
          </Text>
        </View>
      </View>
    );
  }

  const amountColor = credit ? colors.success : colors.danger;
  const signedAmount = `${credit ? "+" : "-"} ${formatINR(txn.amount)}`;
  const celebrate = credit && txn.status === "credited";

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <ScreenHeader title={t("transaction_history.detail_title")} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}
      >
        <Animated.View entering={FadeInUp.duration(450).easing(Easing.out(Easing.cubic))}>
          <TicketStyleCard
            footerText={txn.reference}
            head={
              <>
                <AnimatedTick size={64} color={colors.success} active loop={false} />
                <Text style={[s.heroTitle, { color: colors.textPrimary }]}>{txn.title}</Text>
                <Text style={[s.heroSub, { color: colors.textSecondary }]}>{txn.partner}</Text>
              </>
            }
          >
            {/* Identifiers — invoice ref & UTR are copyable */}
            <InfoLine label={t("transaction_history.reference")} value={txn.reference} copyable />
            <InfoLine label={t("transaction_history.utr_number")} value={txn.utr} copyable />
            <InfoLine label={t("transaction_history.date_time")} value={formatStamp(txn.occurredAt)} />

            <View style={[s.divider, { backgroundColor: colors.divider }]} />

            <InfoLine label={t("transaction_history.type")} value={txn.title} />
            <InfoLine label={t("transaction_history.partner")} value={txn.partner} />
            {txn.invoiceAmount != null ? (
              <InfoLine label={t("transaction_history.invoice_amount")} value={formatINR(txn.invoiceAmount)} />
            ) : null}
            {txn.financedAmount != null ? (
              <InfoLine label={t("transaction_history.financed_amount")} value={formatINR(txn.financedAmount)} />
            ) : null}
            {txn.financingFee != null ? (
              <InfoLine label={t("transaction_history.financing_fee")} value={formatINR(txn.financingFee)} />
            ) : null}
            <InfoLine
              label={t("transaction_history.amount")}
              value={signedAmount}
              valueColor={amountColor}
              strong
            />

            {txn.creditedTo ? (
              <InfoLine
                label={t("transaction_history.credited_to")}
                value={maskAccount(txn.creditedTo)}
                valueColor={amountColor}
                strong
              />
            ) : null}
          </TicketStyleCard>
        </Animated.View>

        {txn.remarks ? (
          <Text style={[s.remarks, { color: colors.textMuted }]}>{txn.remarks}</Text>
        ) : null}

        <View style={s.actions}>
          <PrimaryButton
            title={t("transaction_history.download_receipt")}
            variant="secondary"
            style={s.actionBtn}
            loading={downloading}
            loadingLabel={t("transaction_history.downloading")}
            leftAccessory={
              <MaterialCommunityIcons name="tray-arrow-down" size={18} color={colors.accent} />
            }
            onPress={handleDownloadReceipt}
          />
          <PrimaryButton
            title={t("transaction_history.need_help")}
            style={s.actionBtn}
            color={colors.primaryDark}
            leftAccessory={<MaterialCommunityIcons name="headset" size={18} color="#fff" />}
            onPress={() => navigation.navigate("help-support")}
          />
        </View>
      </ScrollView>

      {/* Confetti burst painted over the ticket for successful credits */}
      {celebrate ? <ConfettiOverlay active /> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  scroll: { paddingTop: 4, gap: 16 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingBottom: 80 },
  emptyText: { fontSize: 14 },
  heroTitle: { fontSize: 18, fontWeight: "800", textAlign: "center", marginTop: 10 },
  heroSub: { fontSize: 13, textAlign: "center", marginTop: 4 },
  line: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  lineLabel: { fontSize: 14 },
  lineRight: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 },
  lineValue: { fontSize: 14, fontWeight: "600", flexShrink: 1, textAlign: "right", fontVariant: ["tabular-nums"] },
  lineValueStrong: { fontSize: 15, fontWeight: "700" },
  pressed: { opacity: 0.5 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  remarks: { fontSize: 12, textAlign: "center", lineHeight: 18, paddingHorizontal: 24 },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1 },
});
