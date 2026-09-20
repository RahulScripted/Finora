import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { COMPANY_NAME, MAP_URL, OFFICE_ADDRESS, OFFICE_COORDS } from "@data-types/about/constants";

const open = (url: string) => Linking.openURL(url).catch(() => undefined);

/** Static office map preview with an overlay that opens the location in Maps. */
export default function OfficeMap() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[s.mapWrap, { borderColor: colors.border }]}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        liteMode
        toolbarEnabled={false}
        initialRegion={{ ...OFFICE_COORDS, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Marker coordinate={OFFICE_COORDS} title={COMPANY_NAME} description={OFFICE_ADDRESS} pinColor={colors.accent} />
      </MapView>
      <Pressable
        onPress={() => open(MAP_URL)}
        accessibilityRole="button"
        accessibilityLabel={t("about_app.open_in_maps")}
        style={({ pressed }) => [
          s.mapOverlay,
          { backgroundColor: colors.card, borderColor: colors.border },
          pressed && s.pressed,
        ]}
      >
        <View style={s.rowText}>
          <Text style={[s.rowLabel, { color: colors.textSecondary }]}>{t("about_app.headquarters")}</Text>
          <Text style={[s.rowValue, { color: colors.textPrimary }]} numberOfLines={2}>
            {OFFICE_ADDRESS}
          </Text>
        </View>
        <View style={[s.directionsButton, { backgroundColor: colors.textPrimary }]}>
          <MaterialCommunityIcons name="navigation-variant-outline" size={18} color={colors.background} />
        </View>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  mapWrap: { height: 200, borderRadius: 18, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth },
  mapOverlay: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  directionsButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1, minWidth: 0 },
  rowLabel: { fontSize: 12 },
  rowValue: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  pressed: { opacity: 0.6 },
});
