import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { PrimaryButton } from "@helpers/button";
import type { ContactActionPayload } from "@data-types/support/constants";

type Props = {
  payload: ContactActionPayload;
  /** Ref to the view that should be captured as a screenshot. */
  captureTargetRef?: React.RefObject<View>;
  onDismiss: () => void;
};

type Step = "consent" | "countdown" | "review" | "idle";

export default function ContactAction({ payload, captureTargetRef, onDismiss }: Props) {
  const { colors } = useTheme();
  const [step, setStep] = useState<Step>("consent");
  const [countdown, setCountdown] = useState(3);
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startCountdown = useCallback(() => {
    setStep("countdown");
    setCountdown(3);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearTimer();
          captureScreen();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearTimer(), []);

  const captureScreen = async () => {
    try {
      if (captureTargetRef?.current) {
        const uri = await captureRef(captureTargetRef, { format: "jpg", quality: 0.8 });
        setScreenshotUri(uri);
      } else {
        setScreenshotUri(null);
      }
      setStep("review");
    } catch {
      setScreenshotUri(null);
      setStep("review");
    }
  };

  const proceed = useCallback(
    (withScreenshot: boolean) => {
      const finalPayload: ContactActionPayload = {
        ...payload,
        screenshotUri: withScreenshot && screenshotUri ? screenshotUri : undefined,
      };
      openContact(finalPayload);
      onDismiss();
    },
    [payload, screenshotUri, onDismiss],
  );

  const openContact = async (p: ContactActionPayload) => {
    if (p.type === "whatsapp") {
      const text = encodeURIComponent(p.body);
      // On mobile, open the WhatsApp app directly via its deep link.
      // Fall back to the wa.me web URL (web / app not installed).
      const appUrl = `whatsapp://send?phone=${p.to}&text=${text}`;
      const webUrl = `https://wa.me/${p.to}?text=${text}`;
      try {
        const canOpenApp = await Linking.canOpenURL(appUrl);
        await Linking.openURL(canOpenApp ? appUrl : webUrl);
      } catch {
        Linking.openURL(webUrl).catch(() => Alert.alert("WhatsApp not installed"));
      }
    } else {
      const subject = encodeURIComponent(p.subject ?? "Support Request");
      const body = encodeURIComponent(p.body);
      Linking.openURL(`mailto:${p.to}?subject=${subject}&body=${body}`).catch(() =>
        Alert.alert("No email app found"),
      );
    }
  };

  const isWhatsApp = payload.type === "whatsapp";
  const icon = isWhatsApp ? "whatsapp" : "email-outline";
  const iconColor = isWhatsApp ? "#25D366" : colors.accent;
  const label = isWhatsApp ? "WhatsApp" : "Email";

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onDismiss} statusBarTranslucent>
      <View style={[s.overlay, { backgroundColor: colors.overlay }]}>
        {step === "consent" && (
          <View style={[s.sheet, { backgroundColor: colors.card }]}>
            <View style={[s.iconWrap, { backgroundColor: iconColor + "18" }]}>
              <MaterialCommunityIcons name={icon as any} size={32} color={iconColor} />
            </View>
            <Text style={[s.title, { color: colors.textPrimary }]}>
              {label} Support
            </Text>
            <Text style={[s.body, { color: colors.textSecondary }]}>
              {isWhatsApp
                ? `You'll be redirected to WhatsApp. Your message will include your loan account details.`
                : `You'll be redirected to your email app. The email will include your loan account details.`}
            </Text>
            <Text style={[s.preview, { color: colors.textMuted, backgroundColor: colors.background }]}>
              {payload.body.slice(0, 120)}…
            </Text>
            <Text style={[s.screenshotNote, { color: colors.textSecondary }]}>
              Would you like to attach a screenshot of your current screen?
            </Text>
            <View style={s.btnRow}>
              <PrimaryButton
                title="Proceed without"
                variant="secondary"
                style={s.halfBtn}
                onPress={() => proceed(false)}
              />
              <PrimaryButton
                title="With screenshot"
                style={s.halfBtn}
                onPress={startCountdown}
              />
            </View>
            <TouchableOpacity onPress={onDismiss} style={s.cancel}>
              <Text style={[s.cancelText, { color: colors.textMuted }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "countdown" && (
          <View style={[s.countdownWrap, { backgroundColor: colors.overlay }]}>
            <Text style={s.countdownNum}>{countdown}</Text>
            <Text style={[s.countdownLabel, { color: "#fff" }]}>Capturing screen…</Text>
          </View>
        )}

        {step === "review" && (
          <View style={[s.sheet, { backgroundColor: colors.card }]}>
            <Text style={[s.title, { color: colors.textPrimary }]}>Review Screenshot</Text>
            {screenshotUri ? (
              <Image source={{ uri: screenshotUri }} style={s.screenshotImg} resizeMode="contain" />
            ) : (
              <View style={[s.screenshotPlaceholder, { backgroundColor: colors.background }]}>
                <MaterialCommunityIcons name="image-off-outline" size={40} color={colors.textMuted} />
                <Text style={[s.body, { color: colors.textMuted }]}>Screenshot unavailable</Text>
              </View>
            )}
            <View style={s.btnCol}>
              <PrimaryButton title="Proceed" onPress={() => proceed(true)} />
              <PrimaryButton
                title="Capture again"
                variant="secondary"
                onPress={startCountdown}
              />
              <TouchableOpacity onPress={onDismiss} style={s.cancel}>
                <Text style={[s.cancelText, { color: colors.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  body: { fontSize: 13, lineHeight: 20, textAlign: "center" },
  preview: {
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
    borderRadius: 10,
    fontStyle: "italic",
  },
  screenshotNote: { fontSize: 13, textAlign: "center" },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  halfBtn: { flex: 1 },
  btnCol: { gap: 10, marginTop: 4 },
  cancel: { alignItems: "center", paddingVertical: 8 },
  cancelText: { fontSize: 14 },
  countdownWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  countdownNum: { fontSize: 96, fontWeight: "800", color: "#fff" },
  countdownLabel: { fontSize: 16, marginTop: 8 },
  screenshotImg: { width: "100%", height: 220, borderRadius: 12 },
  screenshotPlaceholder: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
