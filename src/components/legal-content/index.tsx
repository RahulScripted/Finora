import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type LegalContact = {
  icon: string;
  label: string;
  href: string;
};

type Props = {
  title: string;
  lastUpdated?: string;
  badgeLabel?: string;
  titleNamespace: string;
  contentNamespace: string;
  sectionKeys: readonly string[];
  contactTitle?: string;
  contacts?: LegalContact[];
  footer?: string;
};

function ContactRow({ icon, label, href }: LegalContact) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={s.contactRow} onPress={() => Linking.openURL(href)}>
      <MaterialCommunityIcons name={icon as any} size={16} color={colors.info} />
      <Text style={[s.contactLink, { color: colors.info }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function LegalContentScreen({
  title,
  lastUpdated,
  badgeLabel,
  titleNamespace,
  contentNamespace,
  sectionKeys,
  contactTitle,
  contacts,
  footer,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <ScreenHeader title={title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {(badgeLabel || lastUpdated) && (
          <View style={s.badgeRow}>
            {badgeLabel ? (
              <View style={[s.badge, { backgroundColor: colors.accent + "18" }]}>
                <MaterialCommunityIcons name="shield-check" size={16} color={colors.accent} />
                <Text style={[s.badgeText, { color: colors.accent }]}>{badgeLabel}</Text>
              </View>
            ) : null}
            {lastUpdated ? (
              <View style={[s.badge, { backgroundColor: colors.accent + "18" }]}>
                <MaterialCommunityIcons name="calendar-outline" size={14} color={colors.accent} />
                <Text style={[s.badgeText, { color: colors.accent }]}>{lastUpdated}</Text>
              </View>
            ) : null}
          </View>
        )}

        {sectionKeys.map((key) => {
          const points = t(`${contentNamespace}.${key}`, { returnObjects: true }) as string[];
          return (
            <View key={key} style={[s.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>
                {t(`${titleNamespace}.${key}`)}
              </Text>
              {Array.isArray(points) &&
                points.map((point, i) => (
                  <View key={i} style={s.pointRow}>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={18}
                      color={colors.accent}
                      style={s.pointIcon}
                    />
                    <Text style={[s.pointText, { color: colors.textSecondary }]}>{point}</Text>
                  </View>
                ))}
            </View>
          );
        })}

        {contacts && contacts.length > 0 ? (
          <View style={[s.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {contactTitle ? (
              <Text style={[s.contactTitle, { color: colors.textPrimary }]}>{contactTitle}</Text>
            ) : null}
            {contacts.map((c) => (
              <ContactRow key={c.href} {...c} />
            ))}
          </View>
        ) : null}

        {footer ? <Text style={[s.footer, { color: colors.textMuted }]}>{footer}</Text> : null}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  scroll: { paddingBottom: 24 },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  section: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 10 },
  pointRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  pointIcon: { marginTop: 2, marginRight: 8 },
  pointText: { fontSize: 13, lineHeight: 20, flex: 1 },
  contactCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  contactTitle: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  contactLink: { fontSize: 13, fontWeight: "600" },
  contactAddress: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  footer: { fontSize: 11, textAlign: "center", marginBottom: 8 },
});
