import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ToastConfig } from "react-native-toast-message";
import { LightColors } from "@context/Theme/ThemeContext";
const C = LightColors;

type NotifProps = {
  text1?: string;
  text2?: string;
  accentColor: string;
  icon: string;
  iconColor: string;
  style?: ViewStyle;
};

function NotifToast({ text1, text2, accentColor, icon, iconColor }: NotifProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.outer, { marginTop: insets.top + 8 }]}>
      <View style={[s.stripe, { backgroundColor: accentColor }]} />
      <View style={[s.iconWrap, { backgroundColor: accentColor + "18" }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={s.body}>
        {text1 ? <Text style={s.title} numberOfLines={1}>{text1}</Text> : null}
        {text2 ? <Text style={s.message} numberOfLines={2}>{text2}</Text> : null}
      </View>
    </View>
  );
}

/** Pass this to the `config` prop of <Toast config={toastConfig} />. */
export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <NotifToast
      text1={text1}
      text2={text2}
      accentColor={C.success}
      icon="check-circle-outline"
      iconColor={C.success}
    />
  ),
  error: ({ text1, text2 }) => (
    <NotifToast
      text1={text1}
      text2={text2}
      accentColor={C.danger}
      icon="alert-circle-outline"
      iconColor={C.danger}
    />
  ),
  info: ({ text1, text2 }) => (
    <NotifToast
      text1={text1}
      text2={text2}
      accentColor={C.info}
      icon="information-outline"
      iconColor={C.info}
    />
  ),
};

const s = StyleSheet.create({
  outer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    marginHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    // Shadow — iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    // Shadow — Android
    elevation: 8,
    minHeight: 60,
  },
  stripe: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  body: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111214",
    letterSpacing: -0.1,
  },
  message: {
    fontSize: 12,
    color: "#686B72",
    lineHeight: 17,
  },
});
