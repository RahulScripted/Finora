/**
 * EmptyScreen — reusable shell for screens that are not yet built.
 * Gives every placeholder screen:
 *   • Proper safe-area padding
 *   • ScreenHeader with the screen title
 *   • Centered illustration (icon + label + coming-soon badge)
 *   • Pull-to-refresh with a brief fake loading state
 */
import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState, type ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = {
  /** Screen title shown in the header */
  title: string;
  /** MaterialCommunityIcons name for the center illustration */
  icon?: IconName;
  /** Short label shown under the icon */
  label?: string;
};

export default function EmptyScreen({
  title,
  icon = "clock-outline",
  label,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const displayLabel = label ?? t("common.coming_soon");

  return (
    <View
      style={[
        s.root,
        { backgroundColor: colors.background, paddingTop: insets.top + 16 },
      ]}
    >
      <View style={s.headerWrap}>
        <ScreenHeader title={title} />
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        <View style={s.center}>
          {/* Icon bubble */}
          <View style={[s.bubble, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name={icon} size={44} color={colors.accent} />
          </View>

          {/* Label */}
          <Text style={[s.label, { color: colors.textPrimary }]}>
            {displayLabel}
          </Text>

          {/* Coming soon badge */}
          <View style={[s.badge, { backgroundColor: colors.accent + "18" }]}>
            <Text style={[s.badgeText, { color: colors.accent }]}>
              {t("common.coming_soon")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  headerWrap: { paddingHorizontal: 16 },
  scroll: { flexGrow: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
    gap: 16,
  },
  bubble: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 17, fontWeight: "600", textAlign: "center", lineHeight: 24 },
  badge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 13, fontWeight: "600" },
});
