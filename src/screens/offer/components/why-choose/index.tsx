import { StyleSheet, Text, View } from "react-native";

type Benefit = { key: string; icon: string; tint: string };

const BENEFITS: Benefit[] = [
  { key: "quick_approval", icon: "flash-outline", tint: "#16A477" },
  { key: "secure_compliant", icon: "shield-check-outline", tint: "#3787D8" },
  { key: "flexible_repayment", icon: "calendar-outline", tint: "#7C5CFC" },
  { key: "trusted_business", icon: "account-group-outline", tint: "#E99A24" },
];

const s = StyleSheet.create({
  wrap: { gap: 12 },
  heading: { fontSize: 16, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
    flexGrow: 1,
    flexBasis: "22%",
    minWidth: 78,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 10,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11.5, fontWeight: "600", textAlign: "center", lineHeight: 16 },
});
