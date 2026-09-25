import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import BottomSheet from "@helpers/model";
import { useSupport } from "@hooks/useSupport";
import { buildErrorReport } from "@templates/email";
import { buildWhatsAppError } from "@templates/whatsapp";
import { DEFAULT_CUSTOMER } from "@templates/shared";
import * as Clipboard from "expo-clipboard";
import * as MailComposer from "expo-mail-composer";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { notify } from "@utils/toast";

export type ErrorReportInfo = {
  /** Screen / page where the error happened. */
  screen?: string;
  /** The error object or message. */
  error?: unknown;
};

type ErrorReportContextType = {
  reportError: (info: ErrorReportInfo) => void;
};

const Ctx = createContext<ErrorReportContextType>({ reportError: () => {} });

export const useErrorReport = () => useContext(Ctx);

function extractMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  const e = error as any;
  return e?.response?.data?.message || e?.message || "Unknown error";
}

export function ErrorReportProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { data, submitTicket } = useSupport();

  const [visible, setVisible] = useState(false);
  const infoRef = useRef<ErrorReportInfo>({});

  const reportError = useCallback((info: ErrorReportInfo) => {
    infoRef.current = info;
    setVisible(true);
  }, []);

  const templateVars = () => ({
    ...DEFAULT_CUSTOMER,
    issue_type: t("support.technical_issue"),
    screen: infoRef.current.screen ?? t("support.unknown_screen"),
    error_message: extractMessage(infoRef.current.error) || t("support.generic_error"),
    issue_description: extractMessage(infoRef.current.error) || t("support.generic_error"),
    reference_id: `${Platform.OS} ${Platform.Version}`,
  });

  // Option 1 — raise a diagnostic ticket automatically.
  const handleRaiseTicket = () => {
    setVisible(false);
    const vars = templateVars();
    const ticket = submitTicket({
      category: "Technical & App Issues",
      subcategory: "App Crash",
      description: `${vars.screen} — ${vars.error_message}`,
    });
    notify.success({ title: t("support.ticket_created", { number: ticket.id }) });
  };

  // Option 2 — email support with the auto-filled report.
  const handleEmail = async () => {
    setVisible(false);
    const vars = templateVars();
    const { subject, body } = buildErrorReport(vars);
    const to = data.escalation.email;
    try {
      if (await MailComposer.isAvailableAsync()) {
        await MailComposer.composeAsync({ recipients: [to], subject, body });
        return;
      }
    } catch {
      /* fall through */
    }
    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (await Linking.canOpenURL(url)) Linking.openURL(url);
    else {
      await Clipboard.setStringAsync(`${subject}\n\n${body}`);
      notify.info({ title: t("support.email_copied") });
    }
  };

  // Option 3 — WhatsApp support with the auto-filled report.
  const handleWhatsApp = async () => {
    setVisible(false);
    const body = buildWhatsAppError(templateVars());
    const url = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(body)}`;
    if (await Linking.canOpenURL(url)) Linking.openURL(url);
    else notify.error({ title: t("support.whatsapp_unavailable") });
  };

  return (
    <Ctx.Provider value={{ reportError }}>
      {children}

      <BottomSheet visible={visible} onClose={() => setVisible(false)} title={t("support.error_sheet_title")}>
        <View style={s.content}>
          <View style={[s.iconWrap, { backgroundColor: colors.danger + "18" }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={34} color={colors.danger} />
          </View>
          <Text style={[s.desc, { color: colors.textSecondary }]}>{t("support.error_desc")}</Text>

          <PrimaryButton
            title={t("support.error_raise_ticket")}
            onPress={handleRaiseTicket}
            style={s.btn}
            leftAccessory={<MaterialCommunityIcons name="ticket-outline" size={18} color="#fff" />}
          />
          <PrimaryButton
            title={t("support.error_email")}
            variant="secondary"
            onPress={handleEmail}
            style={s.btn}
            leftAccessory={<MaterialCommunityIcons name="email-outline" size={18} color={colors.accent} />}
          />
          <PrimaryButton
            title={t("support.error_whatsapp")}
            variant="secondary"
            onPress={handleWhatsApp}
            style={s.btn}
            leftAccessory={<MaterialCommunityIcons name="whatsapp" size={18} color={colors.accent} />}
          />
        </View>
      </BottomSheet>
    </Ctx.Provider>
  );
}

const s = StyleSheet.create({
  content: { alignItems: "center", gap: 12, paddingBottom: 8 },
  iconWrap: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  desc: { fontSize: 13, lineHeight: 20, textAlign: "center", paddingHorizontal: 8, marginBottom: 4 },
  btn: { alignSelf: "stretch" },
});
