import { useSpringReveal } from "@animations/spring-reveal";
import { ConfettiOverlay } from "@components/confetti";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  hideClose?: boolean;
  dismissable?: boolean;
  footer?: React.ReactNode;
  confetti?: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const NOTCH_WIDTH = 44;
const NOTCH_HEIGHT = 14;
const RADIUS = 24;
const TOP_HEIGHT = RADIUS;

export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
  hideClose = false,
  dismissable = true,
  footer,
  confetti = false,
}: Props) {
  const { colors } = useTheme();
  const { backdropStyle, contentStyle } = useSpringReveal(visible);

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardOffset(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardOffset(0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Cross icon: slides up from bottom with delay.
  const crossTranslateY = useSharedValue(60);
  const crossOpacity = useSharedValue(0);
  useEffect(() => {
    if (visible) {
      crossTranslateY.value = withDelay(400, withSpring(0, { damping: 12, stiffness: 100 }));
      crossOpacity.value = withDelay(400, withTiming(1, { duration: 250 }));
    } else {
      crossTranslateY.value = withTiming(60, { duration: 200 });
      crossOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, crossTranslateY, crossOpacity]);

  const crossStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: crossTranslateY.value }],
    opacity: crossOpacity.value,
  }));

  const midX = SCREEN_WIDTH / 2;
  const notchLeft = midX - NOTCH_WIDTH / 2;
  const notchRight = midX + NOTCH_WIDTH / 2;
  const path = `M 0 ${TOP_HEIGHT}
    Q 0 0 ${RADIUS} 0
    L ${notchLeft} 0
    C ${notchLeft + 10} 0 ${notchLeft + 6} ${NOTCH_HEIGHT} ${midX} ${NOTCH_HEIGHT}
    C ${notchRight - 6} ${NOTCH_HEIGHT} ${notchRight - 10} 0 ${notchRight} 0
    L ${SCREEN_WIDTH - RADIUS} 0
    Q ${SCREEN_WIDTH} 0 ${SCREEN_WIDTH} ${TOP_HEIGHT}
    L ${SCREEN_WIDTH} ${TOP_HEIGHT}
    L 0 ${TOP_HEIGHT}
    Z`;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[s.overlay, { backgroundColor: colors.overlay }, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissable ? onClose : undefined}
          accessibilityRole="button"
          accessibilityLabel="Close"
          importantForAccessibility={dismissable ? "yes" : "no-hide-descendants"}
        />
        <ConfettiOverlay active={confetti} />
        <Animated.View pointerEvents="box-none" style={[s.kavWrapper, { paddingBottom: keyboardOffset }]}>
          <Animated.View pointerEvents="box-none" style={[s.wrapper, contentStyle]}>
            {!hideClose && (
              <AnimatedTouchable
                onPress={onClose}
                hitSlop={16}
                style={[s.closeBtn, crossStyle]}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <View style={[s.closeBtnBg, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <MaterialCommunityIcons name="close" size={20} color={colors.danger} />
                </View>
              </AnimatedTouchable>
            )}

            {/* Sheet */}
            <View style={s.sheetContainer}>
              <Svg width={SCREEN_WIDTH} height={TOP_HEIGHT} style={s.svgTop}>
                <Path d={path} fill={colors.card} />
              </Svg>
              <View
                style={[
                  s.sheet,
                  { backgroundColor: colors.card, maxHeight: SCREEN_HEIGHT * (footer ? 0.75 : 0.5) - TOP_HEIGHT },
                ]}
              >
                <View style={s.header}>
                  {title ? (
                    <Text style={[s.title, { color: colors.textPrimary }]} accessibilityRole="header">
                      {title}
                    </Text>
                  ) : null}
                </View>
                <ScrollView style={footer ? s.scrollFlexible : undefined} bounces={false} showsVerticalScrollIndicator={false}>
                  {children}
                </ScrollView>
                {footer ? <View style={[s.footer, { backgroundColor: colors.card }]}>{footer}</View> : null}
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  kavWrapper: { flex: 1, justifyContent: "flex-end" },
  wrapper: { alignItems: "center" },
  closeBtn: { width: 36, height: 36, marginBottom: 12 },
  closeBtnBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  sheetContainer: { width: "100%" },
  svgTop: { marginBottom: -1 },
  sheet: { width: "100%", paddingHorizontal: 20, paddingBottom: 32 },
  header: { marginTop: 16, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "700" },
  scrollFlexible: { flexShrink: 1 },
  footer: { paddingTop: 12 },
});
