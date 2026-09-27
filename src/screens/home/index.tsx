import { useTheme } from "@context/Theme/ThemeContext";
import { usePersonal } from "@hooks/usePersonal";
import { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollToTop } from "@shared/scroll-to-top";
import { useRefresh } from "@shared/refresh";
import BirthdayCelebration from "@celebrations/birthday";
import { useBirthday } from "@hooks/useBirthday";
import HomeHeader from "./components/home-header";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { data } = usePersonal();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  // Pull-to-refresh reloads the dashboard content.
  const [, setRefreshKey] = useState(0);
  const { refreshControl } = useRefresh(
    useCallback(() => setRefreshKey((k) => k + 1), []),
  );

  const customerName = data.applicant.displayName;

  // Auto-celebrate the user's birthday on login (once per day).
  const birthday = useBirthday(data.applicant.dateOfBirth);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <HomeHeader customerName={customerName} />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        refreshControl={refreshControl}
      />

      <BirthdayCelebration
        visible={birthday.visible}
        name={customerName}
        onClose={birthday.dismiss}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  scroll: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 8 },
});
