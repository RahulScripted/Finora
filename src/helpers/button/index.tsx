import { useTheme } from "@context/Theme/ThemeContext";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
  type TouchableOpacityProps,
  type ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary";

type Props = Omit<TouchableOpacityProps, "disabled" | "style"> & {
  title: string;
  loading?: boolean;
  /** Text shown while loading. Falls back to `title`. */
  loadingLabel?: string;
  disabled?: boolean;
  variant?: Variant;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftAccessory?: React.ReactNode;
};

export function PrimaryButton({
  title,
  loading = false,
  loadingLabel,
  disabled = false,
  variant = "primary",
  color,
  textColor,
  style,
  textStyle,
  leftAccessory,
  onPress,
  activeOpacity = 0.85,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const isDisabled = loading || disabled;

  const variantStyle: ViewStyle =
    variant === "secondary"
      ? { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.accent }
      : { backgroundColor: colors.accent };

  const variantTextColor = variant === "secondary" ? colors.accent : "#fff";

  const resolvedBg = color ?? (variantStyle.backgroundColor as string);
  const resolvedTextColor = textColor ?? variantTextColor;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      activeOpacity={activeOpacity}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        s.btn,
        variantStyle,
        { backgroundColor: resolvedBg },
        isDisabled && s.disabled,
        style,
      ]}
      {...rest}
    >
      <View style={s.content}>
        {loading ? (
          <ActivityIndicator size="small" color={resolvedTextColor} style={s.spinner} />
        ) : leftAccessory ? (
          leftAccessory
        ) : null}
        <Text style={[s.text, { color: resolvedTextColor }, textStyle]} numberOfLines={1}>
          {loading && loadingLabel ? loadingLabel : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.6 },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  spinner: { marginRight: 2 },
});
