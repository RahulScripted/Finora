import { AnimatedTick } from "@assets/svgs";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet from "./index";

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onClose: () => void;
  /** Pass "success" to show the animated tick. Otherwise pass a MaterialCommunityIcons name. */
  icon?: "success" | string;
  iconColor?: string;
};

export default function AlertModal({
  visible,
  title,
  message,
  buttons,
  onClose,
  icon = "information-outline",
  iconColor,
}: Props) {
  const { colors } = useTheme();

  const resolvedButtons: AlertButton[] =
    buttons && buttons.length > 0 ? buttons : [{ text: "OK", onPress: onClose }];

  const isSuccess = icon === "success";
  const resolvedColor = iconColor ?? (isSuccess ? colors.success : colors.accent);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={s.body}>
        {/* Icon area */}
        {isSuccess ? (
          <AnimatedTick size={80} color={resolvedColor} active={visible} />
        ) : (
          <View style={[s.iconWrap, { backgroundColor: resolvedColor + "22" }]}>
            <MaterialCommunityIcons
              name={icon as any}
              size={32}
              color={resolvedColor}
            />
          </View>
        )}

        <Text style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
        {message ? (
          <Text style={[s.message, { color: colors.textSecondary }]}>{message}</Text>
        ) : null}

        <View style={s.btnRow}>
          {resolvedButtons.map((btn, i) => {
            const isDestructive = btn.style === "destructive";
            const isCancel = btn.style === "cancel";
            const bgColor = isDestructive
              ? colors.danger
              : isCancel
              ? "transparent"
              : colors.accent;
            const textColor = isCancel ? colors.textSecondary : "#fff";
            return (
              <TouchableOpacity
                key={i}
                onPress={() => { btn.onPress?.(); onClose(); }}
                style={[
                  s.btn,
                  { backgroundColor: bgColor },
                  isCancel && { borderWidth: 1, borderColor: colors.border },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[s.btnText, { color: textColor, fontWeight: isCancel ? "500" : "700" }]}>
                  {btn.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  body: { alignItems: "center", paddingBottom: 8 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 17, fontWeight: "700", textAlign: "center", marginBottom: 8, marginTop: 12 },
  message: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 24, paddingHorizontal: 8 },
  btnRow: { flexDirection: "row", gap: 12, width: "100%" },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  btnText: { fontSize: 15 },
});
