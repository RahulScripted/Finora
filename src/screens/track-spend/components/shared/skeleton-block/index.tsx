import { useTheme } from "@context/Theme/ThemeContext";
import { View, type ViewStyle } from "react-native";

type Props = { height: number; style?: ViewStyle };

/** Placeholder block shown while data loads. */
export default function SkeletonBlock({ height, style }: Props) {
  const { colors } = useTheme();
  return <View style={[{ height, borderRadius: 18, backgroundColor: colors.surface }, style]} />;
}
