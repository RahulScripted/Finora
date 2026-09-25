import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import BottomSheet from "@helpers/model";
import { ScreenshotCountdownOverlay } from "@components/screenshot-countdown";
import { captureScreenshot } from "@/src/services/capture-screenshot";
import * as Clipboard from "expo-clipboard";
import * as MailComposer from "expo-mail-composer";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { notify } from "@utils/toast";

export type ContactChannel = "whatsapp" | "email";

export type ScreenshotContactRequest = {
  channel: ContactChannel;
  /** WhatsApp number (digits only) or email address. */
  to: string;
  subject?: string;
  body: string;
};

type Props = {
  request: ScreenshotContactRequest | null;
  onDismiss: () => void;
};

type Step = "consent" | "countdown" | "review";

/**
 * WhatsApp / Email contact flow with an optional screenshot:
 *   consent → 3-2-1 countdown → review (tall preview + tap-to-fullscreen + 3 actions)
 *   → open the channel. Mirrors the company Customer-App report flow.
 */
export default function ScreenshotContactSheet({ request, onDismiss }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>("consent");
  const [captureNonce, setCaptureNonce] = useState(0);
  const [shot, setShot] = useState<string | null>(null);
  const [shotAspect, setShotAspect] = useState(0.5); // width / height
  const [fullView, setFullView] = useState(false);

  useEffect(() => {
    if (request) {
      setStep("consent");
      setShot(null);
      setFullView(false);
    }
  }, [request]);

  const isWhatsApp = request?.channel === "whatsapp";
  const accent = isWhatsApp ? "#25D366" : colors.accent;
  const icon = isWhatsApp ? "whatsapp" : "email-outline";

  // ─── Channel openers ───────────────────────────────────────────
  const openWhatsApp = async (screenshotUri: string | null) => {
    if (!request) return;
    if (screenshotUri && (await Sharing.isAvailableAsync())) {
      try {
        await Sharing.shareAsync(screenshotUri, {
          dialogTitle: request.body,
          mimeType: "image/jpeg",
        });
        return;
      } catch {
        /* fall through */
      }
    }
    const text = encodeURIComponent(request.body);
    // Prefer the native WhatsApp app on mobile; fall back to the wa.me web URL.
    const appUrl = `whatsapp://send?phone=${request.to}&text=${text}`;
    const webUrl = `https://wa.me/${request.to}?text=${text}`;
    if (await Linking.canOpenURL(appUrl)) Linking.openURL(appUrl);
    else if (await Linking.canOpenURL(webUrl)) Linking.openURL(webUrl);
    else notify.error({ title: t("support.whatsapp_unavailable") });
  };

  const openEmail = async (screenshotUri: string | null) => {
    if (!request) return;
    const subject = request.subject ?? t("support.email_subject");
    try {
      if (await MailComposer.isAvailableAsync()) {
        await MailComposer.composeAsync({
          recipients: [request.to],
          subject,
          body: request.body,
          attachments: screenshotUri ? [screenshotUri] : undefined,
        });
        return;
      }
    } catch {
      /* fall through */
    }
    const url = `mailto:${request.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(request.body)}`;
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      await Clipboard.setStringAsync(`${subject}\n\n${request.body}`);
      notify.info({ title: t("support.email_copied") });
    }
  };

  const send = (screenshotUri: string | null) => {
    const channel = request?.channel;
    onDismiss();
    setTimeout(() => {
      if (channel === "whatsapp") openWhatsApp(screenshotUri);
      else openEmail(screenshotUri);
    }, 250);
  };

  // ─── Flow transitions ──────────────────────────────────────────
  const startCapture = () => {
    setCaptureNonce((n) => n + 1);
    setStep("countdown");
  };

  const handleCountdownComplete = async () => {
    const uri = await captureScreenshot();
    if (!uri) {
      send(null); // capture failed → send without
      return;
    }
    // Measure so the preview keeps the shot's true aspect ratio (top-anchored).
    Image.getSize(
      uri,
      (w, h) => setShotAspect(h > 0 ? w / h : 0.5),
      () => setShotAspect(0.5),
    );
    setShot(uri);
    setStep("review");
  };

  const sheetTitle =
    step === "review"
      ? t("support.screenshot_review_title")
      : isWhatsApp
        ? t("support.whatsapp_sheet_title")
        : t("support.email_sheet_title");

  return (
    <>
      <BottomSheet visible={!!request && step !== "countdown"} onClose={onDismiss} title={sheetTitle}>
        {step === "review" ? (
          <View style={s.reviewContent}>
            {/* Full-width preview showing the top portion; tap to expand */}
            {shot ? (
              <TouchableOpacity
                style={[s.previewWrap, { borderColor: colors.border }]}
                activeOpacity={0.9}
                onPress={() => setFullView(true)}
                accessibilityRole="imagebutton"
                accessibilityLabel={t("support.view_full")}
              >
                {/* Full-width, natural aspect ratio, anchored to the top —
                    the wrapper clips the rest so only the top portion shows. */}
                <Image
                  source={{ uri: shot }}
                  style={[s.preview, { aspectRatio: shotAspect }]}
                  resizeMode="cover"
                />
                <View style={s.fullBadge}>
                  <MaterialCommunityIcons name="fullscreen" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            ) : null}

            <View style={s.captionRow}>
              <MaterialCommunityIcons name="image-outline" size={16} color={colors.textMuted} />
              <Text style={[s.caption, { color: colors.textSecondary }]}>{t("support.review_desc")}</Text>
            </View>

            {/* Primary — full row */}
            <PrimaryButton
              title={isWhatsApp ? t("support.send_whatsapp") : t("support.send_email")}
              onPress={() => send(shot)}
              color={accent}
              leftAccessory={<MaterialCommunityIcons name="paperclip" size={16} color="#fff" />}
            />

            {/* Secondary — two on one line */}
            <View style={s.secondaryRow}>
              <PrimaryButton
                title={t("support.recapture")}
                variant="secondary"
                onPress={startCapture}
                style={s.halfBtn}
                textStyle={s.halfBtnText}
                leftAccessory={<MaterialCommunityIcons name="camera-retake-outline" size={15} color={accent} />}
              />
              <PrimaryButton
                title={t("support.send_without_screenshot")}
                variant="secondary"
                onPress={() => send(null)}
                style={s.halfBtn}
                textStyle={s.halfBtnText}
                leftAccessory={<MaterialCommunityIcons name="skip-next-outline" size={15} color={accent} />}
              />
            </View>
          </View>
        ) : (
          <View style={s.content}>
            <View style={[s.iconWrap, { backgroundColor: accent + "18" }]}>
              <MaterialCommunityIcons name={icon as any} size={34} color={accent} />
            </View>
            <Text style={[s.desc, { color: colors.textSecondary }]}>
              {t("support.screenshot_desc")}
            </Text>
            <PrimaryButton
              title={t("support.screenshot_allow")}
              onPress={startCapture}
              color={accent}
              style={s.btn}
              leftAccessory={<MaterialCommunityIcons name="camera-outline" size={18} color="#fff" />}
            />
            <PrimaryButton
              title={t("support.screenshot_skip")}
              variant="secondary"
              onPress={() => send(null)}
              style={s.btn}
            />
          </View>
        )}
      </BottomSheet>

      <ScreenshotCountdownOverlay
        key={captureNonce}
        active={step === "countdown"}
        seconds={3}
        onComplete={handleCountdownComplete}
      />

      {/* Fullscreen screenshot preview */}
      <Modal
        visible={fullView}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setFullView(false)}
      >
        <View style={s.fullOverlay}>
          <TouchableOpacity
            style={s.fullClose}
            onPress={() => setFullView(false)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          {shot ? <Image source={{ uri: shot }} style={s.fullImage} resizeMode="contain" /> : null}
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  content: { alignItems: "center", gap: 14, paddingBottom: 8 },
  iconWrap: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  desc: { fontSize: 13, lineHeight: 20, textAlign: "center", paddingHorizontal: 8 },
  btn: { alignSelf: "stretch" },
  // Review: full-width preview + stacked actions
  reviewContent: { gap: 12, paddingBottom: 8 },
  // Fixed height shows only the top portion of the screenshot (not scrollable).
  previewWrap: { width: "100%", height: 200, borderRadius: 14, borderWidth: 1, overflow: "hidden", justifyContent: "flex-start" },
  // Full-width image at its natural aspect ratio, pinned to the top edge.
  preview: { position: "absolute", top: 0, left: 0, width: "100%" },
  fullBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  captionRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  caption: { fontSize: 12, flexShrink: 1 },
  secondaryRow: { flexDirection: "row", gap: 10 },
  halfBtn: { flex: 1, paddingHorizontal: 6 },
  halfBtnText: { fontSize: 12, fontWeight: "700" },
  // Fullscreen preview
  fullOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center", alignItems: "center" },
  fullClose: {
    position: "absolute",
    top: 44,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  fullImage: { width: "100%", height: "85%" },
});
