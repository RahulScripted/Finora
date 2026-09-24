import { StyleSheet, Text, View } from "react-native";

type Props = { initials: string; color: string; size?: number };

export default function LogoTile({ initials, color, size = 44 }: Props) {
  return (
    <View
      style={[
        s.tile,
        { width: size, height: size, borderRadius: size * 0.28, backgroundColor: color },
      ]}
    >
      <Text style={[s.text, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  tile: { alignItems: "center", justifyContent: "center" },
  text: { color: "#fff", fontWeight: "700", letterSpacing: 0.5 },
});
