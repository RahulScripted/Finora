import MenuRow from "@components/menu-row";
import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PROFILE_SECTIONS } from "@data-types/profile/constants";
import { useScrollToTop } from "@shared/scroll-to-top";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <ScreenHeader title="Profile" />
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {PROFILE_SECTIONS.map((section) => (
          <View key={section.title} style={s.section}>
            {section.title ? (
              <Text style={[s.sectionTitle, { color: colors.textMuted }]}>{section.title}</Text>
            ) : null}
            <View style={s.list}>
              {section.items.map((item) => (
                <MenuRow
                  key={item.route}
                  icon={item.icon}
                  label={item.label}
                  subtitle={item.subtitle}
                  color={item.color}
                  onPress={() => navigation.navigate(item.route)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  scroll: { paddingBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 },
  list: { gap: 10 },
});
