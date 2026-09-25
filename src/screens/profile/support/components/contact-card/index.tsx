import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ContactPerson } from "@data-types/support/constants";
import { getPersonInitials } from "@utils/format-locals";

type Props = { title: string; person: ContactPerson; accent: string };

export default function ContactCard({ title, person, accent }: Props) {
  const { colors } = useTheme();
  const initials = getPersonInitials(person.name);

  const call = () => {
    const digits = person.mobile.replace(/[^\d+]/g, "");
    if (digits) Linking.openURL(`tel:${digits}`);
  };
  const mail = () => {
    if (person.email) Linking.openURL(`mailto:${person.email}`);
  };

  return (
    <View>
      <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>

      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Header: avatar · name/role · call button */}
        <View style={s.top}>
          <View style={[s.avatar, { backgroundColor: accent + "1A" }]}>
            <Text style={[s.avatarText, { color: accent }]}>{initials}</Text>
          </View>
          <View style={s.nameCol}>
            <Text style={[s.name, { color: colors.textPrimary }]} numberOfLines={1}>
              {person.name}
            </Text>
            <Text style={[s.role, { color: colors.textSecondary }]} numberOfLines={1}>
              {person.role}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.callBtn, { borderColor: colors.border }]}
            onPress={call}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="phone" size={18} color={accent} />
          </TouchableOpacity>
        </View>

        <View style={[s.divider, { backgroundColor: colors.divider }]} />

        {/* Contact rows */}
        <TouchableOpacity style={s.row} onPress={mail} activeOpacity={0.7}>
          <MaterialCommunityIcons name="email-outline" size={16} color={colors.textMuted} />
          <Text style={[s.rowText, { color: colors.textSecondary }]} numberOfLines={1}>
            {person.email}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.row} onPress={call} activeOpacity={0.7}>
          <MaterialCommunityIcons name="phone-outline" size={16} color={colors.textMuted} />
          <Text style={[s.rowText, { color: colors.textSecondary }]} numberOfLines={1}>
            {person.mobile}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  sectionTitle: { fontSize: 13, fontWeight: "600", marginBottom: 10, marginLeft: 4 },
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontWeight: "700" },
  nameCol: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700" },
  role: { fontSize: 12, marginTop: 2 },
  callBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  rowText: { fontSize: 13, flex: 1 },
});
