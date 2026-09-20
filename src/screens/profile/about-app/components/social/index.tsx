import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { SOCIAL_LINKS } from "@data-types/about/constants";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const open = (url: string) => Linking.openURL(url).catch(() => undefined);

/** Row of social icons. Links without a URL are shown but inert. */
export default function SocialLinks() {
  const { colors } = useTheme();

  return (
    <View style={s.row}>
      {SOCIAL_LINKS.map((link) => {
        const url = (link as { url?: string }).url;
        return (
          <Pressable
            key={link.name}
            onPress={url ? () => open(url) : undefined}
            accessibilityRole="link"
            accessibilityLabel={link.name}
            style={({ pressed }) => [
              s.icon,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && s.pressed,
            ]}
          >
            <MaterialCommunityIcons name={link.icon as IconName} size={22} color={colors.textPrimary} />
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4 },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.6 },
});
