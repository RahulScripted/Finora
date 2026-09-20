import Logo from "@assets/svgs/Logo";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { randomTagline } from "@utils/tagline";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";
const PLATFORM_LABEL = Platform.select({ ios: "iOS", android: "Android", default: Platform.OS });

const LOGO_SIZE = 64;
const HALO_SIZE = 200;
const HALO_RINGS = [
  { r: 50, opacity: 0.22 },
  { r: 72, opacity: 0.12 },
  { r: 96, opacity: 0.07 },
];

/** Branding hero: logo halo, app name, random tagline, secure pill, and version/platform meta. */
export default function AboutHero() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  // Pick one tagline per mount so it stays stable across re-renders.
  const tagline = useRef(randomTagline()).current;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        progress.setValue(1);
        return;
      }
      Animated.timing(progress, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    return () => {
      cancelled = true;
    };
  }, [progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  const meta = [
    { label: t("about_app.version"), value: APP_VERSION },
    { label: t("about_app.platform"), value: PLATFORM_LABEL },
  ];

  return (
    <Animated.View style={[s.hero, { opacity: progress, transform: [{ translateY }] }]}>
      <View style={s.haloWrap}>
        <Svg width={HALO_SIZE} height={HALO_SIZE} style={StyleSheet.absoluteFill} pointerEvents="none">
          {HALO_RINGS.map(({ r, opacity }) => (
            <Circle
              key={r}
              cx={HALO_SIZE / 2}
              cy={HALO_SIZE / 2}
              r={r}
              fill="none"
              stroke={colors.accent}
              strokeOpacity={opacity}
              strokeWidth={1}
            />
          ))}
        </Svg>
        <Logo size={LOGO_SIZE} />
      </View>

      <Text style={[s.appName, { color: colors.textPrimary }]}>{t("about_app.app_name")}</Text>
      <Text style={[s.tagline, { color: colors.textSecondary }]}>{tagline}</Text>

      <View style={s.pillRow}>
        <View style={[s.pill, { backgroundColor: colors.successSoft }]}>
          <MaterialCommunityIcons name="shield-check-outline" size={14} color={colors.success} />
          <Text style={[s.pillText, { color: colors.success }]}>{t("about_app.secure")}</Text>
        </View>
      </View>

      <View style={[s.meta, { borderTopColor: colors.divider }]}>
        {meta.map((item, i) => (
          <View
            key={item.label}
            style={[
              s.metaCell,
              i > 0 && { borderLeftColor: colors.divider, borderLeftWidth: StyleSheet.hairlineWidth },
            ]}
          >
            <Text style={[s.metaValue, { color: colors.textPrimary }]}>{item.value}</Text>
            <Text style={[s.metaLabel, { color: colors.textMuted }]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: "center" },
  haloWrap: { width: HALO_SIZE, height: HALO_SIZE, alignItems: "center", justifyContent: "center" },
  appName: { fontSize: 26, fontWeight: "700", letterSpacing: -0.4, marginTop: -46 },
  tagline: { fontSize: 14, lineHeight: 20, marginTop: 6, textAlign: "center", paddingHorizontal: 32 },
  pillRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: { fontSize: 12, fontWeight: "600" },
  meta: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metaCell: { flex: 1, alignItems: "center" },
  metaValue: { fontSize: 15, fontWeight: "600" },
  metaLabel: { fontSize: 11, marginTop: 2 },
});
