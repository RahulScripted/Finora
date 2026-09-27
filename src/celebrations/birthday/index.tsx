import { useTheme } from "@context/Theme/ThemeContext";
import BottomSheet from "@helpers/model";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { playSuccess } from "@helpers/sounds";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import Balloons from "./Balloons";

type Props = {
  visible: boolean;
  /** Person to wish. */
  name: string;
  onClose: () => void;
};

/**
 * Birthday celebration shown in the app's standard bottom sheet. Balloons and
 * confetti render inside the sheet's own overlay (via `overlayContent` +
 * `confetti`), so they float full-screen without clipping and never block the
 * close button. Auto-plays a sound when it appears.
 */
export default function BirthdayCelebration({ visible, name, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!visible) {
      setArmed(false);
      return;
    }
    playSuccess();
    // Arm effects a frame after the sheet appears so nothing flashes at origin.
    const id = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(id);
  }, [visible]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      confetti={armed}
      overlayContent={<Balloons active={armed} />}
    >
      <Animated.View entering={FadeInUp.delay(150).springify().damping(16)} style={s.body}>
        <View style={[s.iconWrap, { backgroundColor: colors.accent + "1F" }]}>
          <MaterialCommunityIcons name="cake-variant" size={40} color={colors.accent} />
        </View>

        <Animated.Text entering={FadeIn.delay(300)} style={[s.wish, { color: colors.textPrimary }]}>
          {t("birthday.wish", { name })}
        </Animated.Text>
        <Text style={[s.message, { color: colors.textSecondary }]}>{t("birthday.message")}</Text>
      </Animated.View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  body: { alignItems: "center", paddingBottom: 12 },
  iconWrap: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  wish: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  message: { fontSize: 14, textAlign: "center", lineHeight: 20, marginTop: 10 },
});
