import { AnimatedTick } from "@assets/svgs";
import { useTheme } from "@context/Theme/ThemeContext";
import { PrimaryButton } from "@helpers/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { maskEmail, maskMobile } from "@utils/format-locals";
import BottomSheet from "./index";

type Props = {
  visible: boolean;
  type: "mobile" | "email" | null;
  value: string;
  onClose: () => void;
};

const RESEND_SECONDS = 30;

export default function VerifyContactSheet({ visible, type, value, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset internal state whenever the sheet opens/closes
  useEffect(() => {
    if (!visible) {
      setSent(false);
      setCountdown(RESEND_SECONDS);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    setCountdown(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSend = () => {
    setSent(true);
    startCountdown();
  };

  const isEmail = type === "email";
  const masked = isEmail ? maskEmail(value) : maskMobile(value);
  const icon = isEmail ? "email-outline" : "cellphone-message";

  const title = sent
    ? isEmail
      ? t("personal.verify_email_sent_title")
      : t("personal.verify_mobile_sent_title")
    : isEmail
      ? t("personal.verify_email_title")
      : t("personal.verify_mobile_title");

  const destination = isEmail
    ? t("personal.verify_email_channel")
    : t("personal.verify_mobile_channel");

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={s.body}>
        {sent ? (
          <>
            <AnimatedTick size={88} color={colors.success} active={visible} />
            <Text style={[s.message, { color: colors.textSecondary }]}>
              {t("personal.verify_sent_message", { channel: destination, target: masked })}
            </Text>

            {/* Resend row */}
            {countdown > 0 ? (
              <Text style={[s.resendMuted, { color: colors.textMuted }]}>
                {t("personal.verify_resend_in", { seconds: countdown })}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleSend} activeOpacity={0.7}>
                <Text style={[s.resendActive, { color: colors.accent }]}>
                  {t("personal.verify_resend_now")}
                </Text>
              </TouchableOpacity>
            )}

            <PrimaryButton title={t("common.done")} onPress={onClose} style={s.cta} />
          </>
        ) : (
          <>
            <View style={[s.iconWrap, { backgroundColor: colors.accent + "1A" }]}>
              <MaterialCommunityIcons name={icon as any} size={34} color={colors.accent} />
            </View>

            <Text style={[s.message, { color: colors.textSecondary }]}>
              {t("personal.verify_prompt", { channel: destination })}
            </Text>

            {/* Masked target chip */}
            <View style={[s.targetChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MaterialCommunityIcons
                name={isEmail ? "at" : "phone-outline"}
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[s.targetText, { color: colors.textPrimary }]}>{masked}</Text>
            </View>

            <View style={s.actions}>
              <PrimaryButton
                title={t("common.not_now")}
                variant="secondary"
                onPress={onClose}
                style={s.flexBtn}
              />
              <PrimaryButton
                title={t("personal.verify_send_link", { channel: destination })}
                onPress={handleSend}
                style={s.flexBtn}
              />
            </View>
          </>
        )}
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  body: { alignItems: "center", paddingBottom: 8 },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  message: { fontSize: 14, textAlign: "center", lineHeight: 20, marginTop: 12, paddingHorizontal: 8 },
  targetChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
    marginBottom: 24,
  },
  targetText: { fontSize: 15, fontWeight: "600", letterSpacing: 0.3 },
  actions: { flexDirection: "row", gap: 12, width: "100%" },
  flexBtn: { flex: 1 },
  resendMuted: { fontSize: 13, marginTop: 16, marginBottom: 20 },
  resendActive: { fontSize: 14, fontWeight: "700", marginTop: 16, marginBottom: 20 },
  cta: { marginTop: 4 },
});
