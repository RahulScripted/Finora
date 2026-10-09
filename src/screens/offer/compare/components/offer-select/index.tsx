import BottomSheet from "@helpers/model";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { CompareSlot, Offer, OfferId } from "@data-types/offers/constants";

type Props = {
  options: Offer[];
  selection: Record<CompareSlot, OfferId>;
  onSelect: (slot: CompareSlot, id: OfferId) => void;
};

const SLOT_COLORS: Record<CompareSlot, string> = { A: "#5B6CFF", B: "#FF6B45" };

/** Two side-by-side dropdowns (A vs B). Each opens the shared bottom sheet. */
export default function OfferSelect({ options, selection, onSelect }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState<CompareSlot | null>(null);

  const dropdown = (slot: CompareSlot) => {
    const offer = options.find((o) => o.id === selection[slot]);
    const accent = SLOT_COLORS[slot];
    return (
      <Pressable
        onPress={() => setOpen(slot)}
        accessibilityRole="button"
        style={({ pressed }) => [
          s.field,
          { backgroundColor: colors.card, borderColor: accent, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={[s.badge, { backgroundColor: accent }]}>
          <Text style={s.badgeText}>{slot}</Text>
        </View>
        {offer ? (
          <View style={[s.iconWrap, { backgroundColor: offer.tint + "1F" }]}>
            <MaterialCommunityIcons name={offer.icon as any} size={16} color={offer.tint} />
          </View>
        ) : null}
        <Text style={[s.fieldText, { color: colors.textPrimary }]} numberOfLines={1}>
          {offer ? t(`offers.products.${offer.id}.title`) : ""}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>
    );
  };

  return (
    <View style={s.row}>
      <View style={s.col}>{dropdown("A")}</View>
      <View style={[s.vsWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[s.vs, { color: colors.textMuted }]}>{t("offers.compare.vs")}</Text>
      </View>
      <View style={s.col}>{dropdown("B")}</View>

      <BottomSheet
        visible={open != null}
        onClose={() => setOpen(null)}
        title={open ? t("offers.compare.pick_for", { slot: open }) : ""}
      >
        {options.map((offer) => {
          const active = open ? selection[open] === offer.id : false;
          const takenByOther = open ? selection[open === "A" ? "B" : "A"] === offer.id : false;
          return (
            <Pressable
              key={offer.id}
              disabled={takenByOther}
              onPress={() => {
                if (open) onSelect(open, offer.id);
                setOpen(null);
              }}
              style={({ pressed }) => [
                s.option,
                {
                  backgroundColor: active ? colors.accent + "14" : "transparent",
                  opacity: takenByOther ? 0.4 : pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={[s.iconWrap, { backgroundColor: offer.tint + "1F" }]}>
                <MaterialCommunityIcons name={offer.icon as any} size={18} color={offer.tint} />
              </View>
              <Text style={[s.optionText, { color: colors.textPrimary }]} numberOfLines={1}>
                {t(`offers.products.${offer.id}.title`)}
              </Text>
              {active ? <MaterialCommunityIcons name="check" size={18} color={colors.accent} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  col: { flex: 1 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  badge: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  iconWrap: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  fieldText: { flex: 1, fontSize: 13, fontWeight: "700" },
  vsWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  vs: { fontSize: 11, fontWeight: "800" },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  optionText: { flex: 1, fontSize: 14, fontWeight: "600" },
});
