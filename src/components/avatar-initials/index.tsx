import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  size?: number;
  fontSize?: number;
  /** Draws a soft accent ring around the avatar. */
  ring?: boolean;
  ringWidth?: number;
};

/** Returns up to two uppercase initials from a name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Circular initials avatar, theme-aware, with an optional accent ring. */
export default function AvatarInitials({
  name,
  size = 36,
  fontSize = 13,
  ring = true,
  ringWidth = 2,
}: Props) {
  const { colors } = useTheme();
  const innerSize = ring ? size - ringWidth * 2 : size;

  const circle = (
    <View
      style={[
        s.circle,
        {
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colors.accent + "1F",
        },
      ]}
    >
      <Text style={[s.text, { fontSize, color: colors.accent }]}>{getInitials(name)}</Text>
    </View>
  );

  if (!ring) return circle;

  return (
    <View
      pointerEvents="none"
      style={[
        s.ring,
        { width: size, height: size, borderRadius: size / 2, borderColor: colors.accent + "55" },
      ]}
    >
      {circle}
    </View>
  );
}

const s = StyleSheet.create({
  ring: { alignItems: "center", justifyContent: "center", borderWidth: 2 },
  circle: { alignItems: "center", justifyContent: "center" },
  text: { fontWeight: "800" },
});
