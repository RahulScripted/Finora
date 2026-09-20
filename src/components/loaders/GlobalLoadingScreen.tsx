import { useTheme } from "@context/Theme/ThemeContext";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import Svg, { Polygon } from "react-native-svg";

const DURATION = 2000;
const EM = 16;
const COIN = 4 * EM;

const COIN_FACE = "#D4A017";
const COIN_RING = "#E6C34D";
const COIN_EDGE = "#B8860B";
const COIN_MARK = "#C49A10";

type Props = {
  visible: boolean;
  message?: string;
};

export function GlobalLoadingScreen({ visible, message }: Props) {
  const { colors, resolved } = useTheme();
  const [show, setShow] = useState(false);
  const [coinVisible, setCoinVisible] = useState(false);

  const progress = useSharedValue(0);
  const coinOpacity = useSharedValue(1);
  const blurOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setShow(true);
      setCoinVisible(true);
      blurOpacity.value = withTiming(1, { duration: 200 });
      coinOpacity.value = 1;
      progress.value = 0;
      progress.value = withRepeat(
        withTiming(1, { duration: DURATION, easing: Easing.linear }),
        30,
        false,
      );
    } else if (show) {
      coinOpacity.value = withTiming(0, { duration: 1500 });
      blurOpacity.value = withDelay(
        150,
        withTiming(0, { duration: 200 }, () => {
          runOnJS(setShow)(false);
          runOnJS(setCoinVisible)(false);
        }),
      );
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));

  const coinContainerStyle = useAnimatedStyle(() => ({
    opacity: coinOpacity.value,
  }));

  const bounceStyle = useAnimatedStyle(() => {
    const p = progress.value;
    let y: number;
    if (p < 0.25) {
      const t = p / 0.25;
      y = t * t * t * 4.6 * EM;
    } else if (p < 0.5) {
      const t = (p - 0.25) / 0.25;
      y = (1 - Math.pow(1 - t, 3)) * -4.6 * EM + 4.6 * EM;
    } else if (p < 0.75) {
      const t = (p - 0.5) / 0.25;
      y = t * t * t * 4.6 * EM;
    } else {
      const t = (p - 0.75) / 0.25;
      y = (1 - Math.pow(1 - t, 3)) * -4.6 * EM + 4.6 * EM;
    }
    return { transform: [{ translateY: y }] };
  });

  const rollStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const rotY = p > 0.75 ? -360 * ((p - 0.75) / 0.25) : 0;
    return {
      transform: [
        { perspective: 600 },
        { rotateY: `${-15 + rotY}deg` },
        { rotateZ: "-30deg" },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const p = progress.value;
    let scale: number;
    let op: number;
    if (p < 0.25) {
      const t = p / 0.25;
      const e = t * t * t;
      scale = 0.6 + e * 0.4;
      op = 0.3 + e * 0.2;
    } else if (p < 0.5) {
      const t = (p - 0.25) / 0.25;
      const e = 1 - Math.pow(1 - t, 3);
      scale = 1 - e * 0.4;
      op = 0.5 - e * 0.2;
    } else if (p < 0.75) {
      const t = (p - 0.5) / 0.25;
      const e = t * t * t;
      scale = 0.6 + e * 0.4;
      op = 0.3 + e * 0.2;
    } else {
      const t = (p - 0.75) / 0.25;
      const e = 1 - Math.pow(1 - t, 3);
      scale = 1 - e * 0.4;
      op = 0.5 - e * 0.2;
    }
    return { transform: [{ scaleX: scale }, { scaleY: scale }], opacity: op };
  });

  const flare1Style = useAnimatedStyle(() => {
    const p = progress.value;
    let s = 0;
    if (p > 0.75 && p <= 0.875) s = (p - 0.75) / 0.125;
    else if (p > 0.875) s = 1 - (p - 0.875) / 0.125;
    return { transform: [{ scale: s }], opacity: s };
  });

  const flare2Style = useAnimatedStyle(() => {
    const p = progress.value;
    let s = 0;
    if (p < 0.125) s = 1 - p / 0.125;
    else if (p > 0.875) s = (p - 0.875) / 0.125;
    return { transform: [{ scale: s }], opacity: s };
  });

  const flare3Style = useAnimatedStyle(() => {
    const p = progress.value;
    let s = 0;
    if (p > 0.25 && p <= 0.375) s = (p - 0.25) / 0.125;
    else if (p > 0.375 && p < 0.5) s = 1 - (p - 0.375) / 0.125;
    return { transform: [{ scale: s }], opacity: s };
  });

  const flare4Style = useAnimatedStyle(() => {
    const p = progress.value;
    let s = 0;
    if (p > 0.375 && p <= 0.5) s = (p - 0.375) / 0.125;
    else if (p > 0.5 && p < 0.625) s = 1 - (p - 0.5) / 0.125;
    return { transform: [{ scale: s }], opacity: s };
  });

  if (!show) return null;

  const FlareStar = () => (
    <Svg width={16} height={16} viewBox="0 0 100 100">
      <Polygon
        points="50,0 67,33 100,50 67,67 50,100 33,67 0,50 33,33"
        fill="#fff"
      />
    </Svg>
  );

  return (
    <Modal visible={show} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, overlayStyle]}>
        <BlurView
          intensity={220}
          tint={resolved === "dark" ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                resolved === "dark"
                  ? "rgba(13,15,20,0.7)"
                  : "rgba(244,244,244,0.7)",
            },
          ]}
        />

        {coinVisible && (
          <Animated.View style={[s.coinContainer, coinContainerStyle]}>
            <View style={s.stage}>
              <Animated.View style={[s.coinOuter, bounceStyle]}>
                <Animated.View
                  style={[s.flare, { top: 0, left: -10 }, flare1Style]}
                >
                  <FlareStar />
                </Animated.View>
                <Animated.View
                  style={[s.flare, { top: -10, left: 4 }, flare2Style]}
                >
                  <FlareStar />
                </Animated.View>
                <Animated.View
                  style={[s.flare, { top: 0, right: -10 }, flare3Style]}
                >
                  <FlareStar />
                </Animated.View>
                <Animated.View
                  style={[s.flare, { top: -10, right: 4 }, flare4Style]}
                >
                  <FlareStar />
                </Animated.View>

                <Animated.View style={[s.coinLayers, rollStyle]}>
                  <View style={[s.coinFace, s.coinFront]}>
                    <View style={s.coinInscription} />
                  </View>
                  <View style={s.coinEdge} />
                  <View style={[s.coinFace, s.coinBack]}>
                    <View
                      style={[
                        s.coinInscription,
                        { transform: [{ rotate: "-30deg" }] },
                      ]}
                    />
                  </View>
                </Animated.View>
              </Animated.View>

              <Animated.View style={[s.shadow, shadowStyle]} />
            </View>

            {message && (
              <Animated.Text
                style={[s.message, { color: colors.textSecondary }]}
              >
                {message}
              </Animated.Text>
            )}
          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  coinContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  stage: {
    width: 9.1 * EM,
    height: 9.1 * EM,
    alignItems: "center",
    justifyContent: "space-between",
  },
  coinOuter: {
    width: COIN,
    height: COIN,
    alignItems: "center",
    justifyContent: "center",
  },
  coinLayers: {
    width: COIN,
    height: COIN,
  },
  coinFace: {
    position: "absolute",
    width: COIN,
    height: COIN,
    borderRadius: COIN / 2,
    backgroundColor: COIN_FACE,
    borderWidth: 6,
    borderColor: COIN_RING,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  coinFront: {},
  coinBack: {
    transform: [{ rotateY: "180deg" }],
  },
  coinEdge: {
    position: "absolute",
    top: COIN * 0.1,
    left: COIN / 2 - 5,
    width: 10,
    height: COIN * 0.8,
    backgroundColor: COIN_EDGE,
    borderRadius: 5,
    transform: [{ rotateY: "90deg" }],
    backfaceVisibility: "visible",
  },
  coinInscription: {
    width: 4,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    transform: [{ rotate: "30deg" }],
  },
  flare: {
    position: "absolute",
    width: 16,
    height: 16,
    zIndex: 10,
  },
  shadow: {
    width: COIN,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  message: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: "500",
  },
});
