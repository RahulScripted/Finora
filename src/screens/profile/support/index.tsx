import { ScrollRevealProvider, useScrollRevealValues } from "@animations/scroll-reveal";
import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSupport } from "@hooks/useSupport";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRefresh } from "@shared/refresh";
import { useScrollToTop } from "@shared/scroll-to-top";
import { buildEmail } from "@templates/email";
import { buildWhatsApp } from "@templates/whatsapp";
import { DEFAULT_CUSTOMER } from "@templates/shared";
import ContactCard from "./components/contact-card";
import OptionGrid, { type SupportOption } from "./components/option-grid";
import ScreenshotContactSheet, {
  type ScreenshotContactRequest,
} from "./components/screenshot-contact-sheet";

function SupportInner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { data, refetch } = useSupport();
  const { refreshControl } = useRefresh(refetch);
  const { scrollY, viewportH } = useScrollRevealValues();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const [contactRequest, setContactRequest] = useState<ScreenshotContactRequest | null>(null);
  // Replay entrance animations each time the screen becomes visible.
  const [animKey, setAnimKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setAnimKey((k) => k + 1);
    }, []),
  );

  const options: SupportOption[] = [
    {
      id: "create",
      icon: "ticket-outline",
      label: t("support.action_create"),
      color: "#FF6B45",
      onPress: () => navigation.navigate("support-create-ticket"),
    },
    {
      id: "track",
      icon: "clipboard-text-search-outline",
      label: t("support.action_track"),
      color: "#8B5CF6",
      onPress: () => navigation.navigate("support-track-ticket"),
    },
    {
      id: "whatsapp",
      icon: "whatsapp",
      label: t("support.action_whatsapp"),
      color: "#25D366",
      onPress: () =>
        setContactRequest({
          channel: "whatsapp",
          to: data.whatsappNumber,
          body: buildWhatsApp({ ...DEFAULT_CUSTOMER, issue_type: t("support.general_query") }),
        }),
    },
    {
      id: "email",
      icon: "email-outline",
      label: t("support.action_email"),
      color: "#3B61FF",
      onPress: () => {
        const { subject, body } = buildEmail({
          ...DEFAULT_CUSTOMER,
          issue_type: t("support.general_query"),
        });
        setContactRequest({ channel: "email", to: data.escalation.email, subject, body });
      },
    },
  ];

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("support.title")} />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        scrollEventThrottle={16}
        refreshControl={refreshControl}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
          viewportH.value = e.nativeEvent.layoutMeasurement.height;
        }}
        onLayout={(e) => {
          viewportH.value = e.nativeEvent.layout.height;
        }}
      >
        <View key={animKey} style={s.stack}>
          <OptionGrid options={options} />

          <Animated.View entering={FadeInDown.delay(280).duration(340).easing(Easing.out(Easing.cubic))}>
            <ContactCard
              title={t("support.rm_title")}
              person={data.relationshipManager}
              accent="#3B61FF"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(360).duration(340).easing(Easing.out(Easing.cubic))}>
            <ContactCard
              title={t("support.escalation_title")}
              person={data.escalation}
              accent="#D9460F"
            />
          </Animated.View>
        </View>
      </ScrollView>

      <ScreenshotContactSheet request={contactRequest} onDismiss={() => setContactRequest(null)} />
    </View>
  );
}

export default function SupportScreen() {
  return (
    <ScrollRevealProvider>
      <SupportInner />
    </ScrollRevealProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  stack: { gap: 20 },
});
