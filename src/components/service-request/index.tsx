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

export type ServiceRequestContact = {
  icon: string;
  label: string;
  href: string;
};

type ListBlockKey = "required_details" | "eligibility";

type Props = {
  namespace: string;
  listBlocks?: ListBlockKey[];
  contacts?: ServiceRequestContact[];
};

function BulletList({ points, accent }: { points: string[]; accent: string }) {
  const { colors } = useTheme();
  return (
    <>
      {points.map((point, i) => (
        <View key={i} style={s.pointRow}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={accent}
            style={s.pointIcon}
          />
          <Text style={[s.pointText, { color: colors.textSecondary }]}>{point}</Text>
        </View>
      ))}
    </>
  );
}

export default function ServiceRequestScreen({ namespace, listBlocks = [], contacts }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const information = t(`${namespace}.information`, { returnObjects: true }) as string[];

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <ScreenHeader title={t(`${namespace}.title`)} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Description banner */}
        <View style={[s.banner, { backgroundColor: colors.accent + "18" }]}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.accent} />
          <Text style={[s.bannerText, { color: colors.textPrimary }]}>
            {t(`${namespace}.description`)}
          </Text>
        </View>

        <View style={[s.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>
            {t(`${namespace}.request_title`)}
          </Text>
          {Array.isArray(information) && <BulletList points={information} accent={colors.accent} />}
        </View>

        {/* Titled list blocks (eligibility, required details) */}
        {listBlocks.map((block) => {
          const items = t(`${namespace}.${block}.items`, { returnObjects: true }) as string[];
          return (
            <View key={block} style={[s.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>
                {t(`${namespace}.${block}.title`)}
              </Text>
              {Array.isArray(items) && <BulletList points={items} accent={colors.accent} />}
            </View>
          );
        })}

        {/* Support contact */}
        {contacts && contacts.length > 0 ? (
          <View style={[s.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.contactText, { color: colors.textSecondary }]}>
              {t(`${namespace}.support_message`)}
            </Text>
            {contacts.map((c) => (
              <TouchableOpacity key={c.href} style={s.contactRow} onPress={() => Linking.openURL(c.href)}>
                <MaterialCommunityIcons name={c.icon as any} size={16} color={colors.info} />
                <Text style={[s.contactLink, { color: colors.info }]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  scroll: { paddingBottom: 24 },
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  bannerText: { flex: 1, fontSize: 13, lineHeight: 19 },
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
    marginTop: 2,
    marginBottom: 16,
  },
  contactText: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  contactLink: { fontSize: 13, fontWeight: "600" },
});
