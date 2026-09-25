import ScreenHeader from "@components/screen-header";
import { ConfettiOverlay } from "@components/confetti";
import { AnimatedTick } from "@assets/svgs";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import { playSuccess } from "@helpers/sounds";
import { useSupport } from "@hooks/useSupport";
import { SUPPORT_CATEGORIES } from "@data-types/support/constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FilePickerSheet from "../components/file-picker-sheet";
import TicketStyleCard, { TicketInfoBlock } from "../components/ticket-style-card";

const MIN_DESC = 10;

/** Field label with a red asterisk for mandatory fields. */
function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  const { colors } = useTheme();
  return (
    <Text style={[s.label, { color: colors.textSecondary }]}>
      {text}
      {required ? <Text style={{ color: colors.danger }}> *</Text> : null}
    </Text>
  );
}

/** A single selectable chip with a spring press animation. */
function Chip({
  label,
  active,
  onPress,
  index,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  index: number;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View entering={FadeIn.delay(index * 30)} layout={LinearTransition.duration(220)} style={style}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withTiming(0.94, { duration: 120 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
        style={[
          s.chip,
          {
            borderColor: active ? colors.accent : colors.border,
            backgroundColor: active ? colors.accent + "14" : colors.card,
          },
        ]}
      >
        <Text
          style={[
            s.chipText,
            { color: active ? colors.accent : colors.textSecondary, fontWeight: active ? "700" : "500" },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/** Selectable pill chips (category / subcategory). */
function Chips({
  items,
  selected,
  onSelect,
}: {
  items: { key: string; label: string }[];
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <View style={s.chipWrap}>
      {items.map((item, i) => (
        <Chip
          key={item.key}
          label={item.label}
          active={item.key === selected}
          onPress={() => onSelect(item.key)}
          index={i}
        />
      ))}
    </View>
  );
}

export default function CreateTicketScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { submitTicket } = useSupport();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<{ uri: string; name: string; isImage: boolean } | null>(null);
  const [fileSheetOpen, setFileSheetOpen] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<import("@data-types/support/constants").SupportTicket | null>(null);

  // Reset the whole form each time the screen gains focus, so re-opening it
  // never lands on a stale success page or previously-typed data.
  useFocusEffect(
    useCallback(() => {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setDescription("");
      setAttachment(null);
      setFileSheetOpen(false);
      setCreatedTicket(null);
    }, []),
  );

  const activeCategory = SUPPORT_CATEGORIES.find((c) => c.id === selectedCategory);
  const descLen = description.trim().length;
  const descValid = descLen >= MIN_DESC;
  const canSubmit = !!(selectedCategory && selectedSubcategory && descValid);

  const categoryItems = SUPPORT_CATEGORIES.map((c) => ({ key: c.id, label: c.label }));
  const subcategoryItems = activeCategory?.subcategories.map((sub) => ({ key: sub, label: sub })) ?? [];

  useEffect(() => {
    if (createdTicket) playSuccess();
  }, [createdTicket]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const ticket = submitTicket({
      category: activeCategory!.label,
      subcategory: selectedSubcategory!,
      description: description.trim(),
      screenshotUri: attachment?.uri,
    });
    setCreatedTicket(ticket);
  };

  const handleAttach = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.length) return;
    const file = result.assets[0];
    setAttachment({
      uri: file.uri,
      name: file.name,
      isImage: (file.mimeType ?? "").startsWith("image/"),
    });
  };

  if (createdTicket) {
    const created = new Date(createdTicket.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return (
      <View style={[s.root, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.successScroll, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
        >
          <Animated.View entering={FadeInUp.duration(450)}>
            <TicketStyleCard
              footerText={createdTicket.id}
              head={
                <>
                  <AnimatedTick size={72} color={colors.success} active loop={false} />
                  <Text style={[s.successTitle, { color: colors.textPrimary }]}>
                    {t("support.success_title")}
                  </Text>
                  <Text style={[s.successBody, { color: colors.textSecondary }]}>
                    {t("support.success_body")}
                  </Text>
                </>
              }
            >
              <View style={s.infoRow}>
                <TicketInfoBlock label={t("support.category")} value={createdTicket.category} />
                <TicketInfoBlock label={t("support.subcategory")} value={createdTicket.subcategory} />
              </View>
              <View style={s.infoRow}>
                <TicketInfoBlock label={t("support.created_date")} value={created} />
                <TicketInfoBlock label={t("support.status")} value={t("support.status_open")} accent />
              </View>
            </TicketStyleCard>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(320).duration(400)} style={s.successBtns}>
            <PrimaryButton
              title={t("support.track_my_ticket")}
              onPress={() => navigation.navigate("support-track-ticket")}
            />
            <PrimaryButton
              title={t("support.go_back")}
              variant="secondary"
              onPress={() => navigation.goBack()}
            />
          </Animated.View>
        </ScrollView>

        {/* Rendered last + high z-index so the burst paints over the ticket */}
        <ConfettiOverlay active />
      </View>
    );
  }

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("support.create_title")} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category — chips */}
        <FieldLabel text={t("support.category")} required />
        <Chips
          items={categoryItems}
          selected={selectedCategory}
          onSelect={(key) => {
            setSelectedCategory(key);
            setSelectedSubcategory(null);
          }}
        />

        {/* Subcategory — chips (animates in after a category is picked) */}
        {selectedCategory ? (
          <Animated.View entering={FadeInDown.duration(320).easing(Easing.out(Easing.cubic))}>
            <FieldLabel text={t("support.subcategory")} required />
            <Chips items={subcategoryItems} selected={selectedSubcategory} onSelect={setSelectedSubcategory} />
          </Animated.View>
        ) : null}

        {/* Description with attachment button bottom-left */}
        <FieldLabel text={t("support.description")} required />
        <View style={[s.descBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[s.textArea, { color: colors.textPrimary }]}
            placeholder={t("support.desc_placeholder", { count: MIN_DESC })}
            placeholderTextColor={colors.textMuted}
            multiline
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          {/* Attachment preview — image thumb or file chip */}
          {attachment ? (
            attachment.isImage ? (
              <Animated.View entering={FadeIn.duration(250)} style={s.thumbRow}>
                <Image source={{ uri: attachment.uri }} style={s.thumb} />
                <TouchableOpacity
                  style={[s.thumbRemove, { backgroundColor: colors.danger }]}
                  onPress={() => setAttachment(null)}
                  hitSlop={8}
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons name="close" size={12} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeIn.duration(250)} style={s.fileChipRow}>
                <View style={[s.fileChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={16} color={colors.accent} />
                  <Text style={[s.fileName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {attachment.name}
                  </Text>
                  <TouchableOpacity onPress={() => setAttachment(null)} hitSlop={8} accessibilityRole="button">
                    <MaterialCommunityIcons name="close-circle" size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )
          ) : null}

          {/* Footer: link/attach icon bottom-left + char counter bottom-right */}
          <View style={[s.descFooter, { borderTopColor: colors.divider }]}>
            <TouchableOpacity
              style={s.attachInline}
              onPress={() => setFileSheetOpen(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="link-variant" size={18} color={colors.accent} />
              <Text style={[s.attachInlineText, { color: colors.accent }]}>
                {t("support.attach_file")}
              </Text>
            </TouchableOpacity>

            <Text style={[s.charCount, { color: descValid ? colors.textMuted : colors.danger }]}>
              {descLen}/{t("support.desc_min", { count: MIN_DESC })}
            </Text>
          </View>
        </View>

        <PrimaryButton
          title={t("support.submit")}
          disabled={!canSubmit}
          style={{ marginTop: 20 }}
          onPress={handleSubmit}
        />
      </ScrollView>

      <FilePickerSheet
        visible={fileSheetOpen}
        onClose={() => setFileSheetOpen(false)}
        onPickFile={handleAttach}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 50, borderWidth: 1 },
  chipText: { fontSize: 13 },
  descBox: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  textArea: { paddingHorizontal: 14, paddingTop: 12, fontSize: 14, lineHeight: 22, minHeight: 120 },
  thumbRow: { paddingHorizontal: 14, paddingBottom: 8 },
  thumb: { width: 72, height: 72, borderRadius: 10 },
  fileChipRow: { paddingHorizontal: 14, paddingBottom: 8 },
  fileChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fileName: { flex: 1, fontSize: 13, fontWeight: "500" },
  thumbRemove: {
    position: "absolute",
    top: -4,
    left: 62,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  descFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  attachInline: { flexDirection: "row", alignItems: "center", gap: 6 },
  attachInlineText: { fontSize: 13, fontWeight: "600" },
  charCount: { fontSize: 11 },
  successScroll: { paddingHorizontal: 16 },
  successTitle: { fontSize: 19, fontWeight: "800", textAlign: "center", marginTop: 10 },
  successBody: { fontSize: 13, textAlign: "center", lineHeight: 20, marginTop: 6 },
  infoRow: { flexDirection: "row", gap: 16 },
  successBtns: { marginTop: 24, gap: 12 },
});
