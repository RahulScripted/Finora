import { useTheme } from "@context/Theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuRow from "@components/menu-row";
import ProfileCard from "@components/profile-card";
import { MORE_MENU } from "@data-types/more/constants";
import { useScrollToTop } from "@shared/scroll-to-top";

export default function MoreScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <Text style={[s.title, { color: colors.textPrimary }]}>More</Text>

      <ProfileCard
        name="Rahul Goswami"
        email="rahul@finora.in"
        onPress={() => navigation.navigate("profile")}
      />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        {MORE_MENU.map((item) => (
          <MenuRow
            key={item.route}
            icon={item.icon}
            label={item.label}
            color={item.color}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}
        <MenuRow
          icon="logout"
          label="Logout"
          color={colors.danger}
          danger
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  list: { gap: 10, paddingBottom: 24 },
});
