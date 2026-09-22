import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePersonal } from "@hooks/usePersonal";
import { useUnmaskField } from "@hooks/useUnmaskField";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AlertModal from "@helpers/model/AlertModal";
import VerifyContactSheet from "@helpers/model/VerifyContactSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDob, formatAddress } from "@utils/format-locals";
import EditFieldSheet from "../shared/contact-details/EditFieldSheet";
import FieldRow from "../shared/contact-details/FieldRow";
import SectionLabel from "../shared/contact-details/SectionLabel";

export default function CoApplicantDetailScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const { data, updateCoApplicant } = usePersonal();
  const { unmask, getState, clear } = useUnmaskField();

  const coId: string = route.params?.id;
  const [editing, setEditing] = useState<{ field: string; label: string; value: string } | null>(null);
  const [alert, setAlert] = useState<{ title: string; message: string; icon?: string } | null>(null);
  const [verify, setVerify] = useState<{ type: "mobile" | "email"; value: string } | null>(null);

  const co = data.coApplicants.find((c: { id: string }) => c.id === coId);

  if (!co) {
    return (
      <View style={[s.root, { backgroundColor: colors.background }]}>
        <View style={[s.headerWrap, { paddingTop: insets.top + 16 }]}>
          <ScreenHeader title="Co-applicant" />
        </View>
      </View>
    );
  }

  const panState = getState(co.id, "pan");
  const verified = co.kycStatus === "verified";

  const handleSave = (value: string) => {
    if (!editing) return;
    const { field } = editing;
    if (field === "mobile") updateCoApplicant(co.id, { contact: { ...co.contact, mobile: value } });
    else if (field === "email") updateCoApplicant(co.id, { contact: { ...co.contact, email: value } });
    else if (field === "address") updateCoApplicant(co.id, { residentialAddress: { ...co.residentialAddress, line1: value } });
    setEditing(null);
    setAlert({ title: t("personal.saved_alert_title"), message: t("personal.coapplicant_saved_message"), icon: "success" });
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.headerWrap, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("personal.coapplicant_detail_title")} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
      >
        {/* Hero */}
        <View style={s.hero}>
          <View style={[s.avatarFallback, { backgroundColor: "#588FB5" }]}>
            <Text style={s.avatarInitials}>{co.initials}</Text>
          </View>
          <Text style={[s.heroName, { color: colors.textPrimary }]}>{co.displayName}</Text>
          <Text style={[s.heroRole, { color: colors.textSecondary }]}>
            {t("personal.co_applicant")} | {co.relationshipToApplicant}
          </Text>
          <View style={[s.kycBadge, { backgroundColor: verified ? colors.successSoft : colors.warningSoft }]}>
            <MaterialCommunityIcons
              name={verified ? "check-circle" : "clock-outline"}
              size={13}
              color={verified ? colors.success : colors.warning}
            />
            <Text style={[s.kycText, { color: verified ? colors.success : colors.warning }]}>
              {verified ? t("personal.kyc_verified") : t("personal.kyc_pending")}
            </Text>
          </View>
        </View>

        <SectionLabel label={t("personal.section_contact")} />
        <View style={[s.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FieldRow
            label={t("personal.field_mobile")}
            value={co.contact.mobile}
            verified={co.contact.mobileVerified}
            unverified={!co.contact.mobileVerified}
            editable={co.contact.mobileVerified}
            onEdit={() => setEditing({ field: "mobile", label: t("personal.field_mobile"), value: co.contact.mobile })}
            onVerify={() => setVerify({ type: "mobile", value: co.contact.mobile })}
          />
          <FieldRow
            label={t("personal.field_email")}
            value={co.contact.email}
            verified={co.contact.emailVerified}
            unverified={!co.contact.emailVerified}
            editable={co.contact.emailVerified}
            onEdit={() => setEditing({ field: "email", label: t("personal.field_email"), value: co.contact.email })}
            onVerify={() => setVerify({ type: "email", value: co.contact.email })}
          />
        </View>

        <SectionLabel label={t("personal.section_coapplicant_details")} />
        <View style={[s.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FieldRow label={t("personal.field_full_name")} value={co.fullNameAsPerPan} />
          <FieldRow label={t("personal.field_dob")} value={formatDob(co.dateOfBirth)} />
          <FieldRow
            label={t("personal.field_pan")}
            value={co.pan}
            sensitive
            unmaskedValue={panState.value}
            isUnmasking={panState.isLoading}
            onUnmask={() => unmask(co.id, "pan")}
            onMask={() => clear(co.id, "pan")}
          />
          <FieldRow
            label={t("personal.field_address")}
            value={formatAddress(co.residentialAddress)}
            editable
            onEdit={() => setEditing({ field: "address", label: t("personal.field_address"), value: co.residentialAddress.line1 })}
          />
          <FieldRow label={t("personal.field_relationship_applicant")} value={co.relationshipToApplicant} />
        </View>
      </ScrollView>

      <EditFieldSheet
        visible={!!editing}
        label={editing?.label ?? ""}
        value={editing?.value ?? ""}
        onSave={handleSave}
        onClose={() => setEditing(null)}
      />

      <AlertModal
        visible={!!alert}
        title={alert?.title ?? ""}
        message={alert?.message}
        icon={alert?.icon ?? "information-outline"}
        onClose={() => setAlert(null)}
      />

      <VerifyContactSheet
        visible={!!verify}
        type={verify?.type ?? null}
        value={verify?.value ?? ""}
        onClose={() => setVerify(null)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  headerWrap: { paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  hero: { alignItems: "center", paddingVertical: 24, gap: 8 },
  avatarFallback: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  avatarInitials: { color: "#fff", fontSize: 28, fontWeight: "700" },
  heroName: { fontSize: 18, fontWeight: "700" },
  heroRole: { fontSize: 13 },
  kycBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  kycText: { fontSize: 12, fontWeight: "600" },
  group: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, marginBottom: 20, overflow: "hidden" },
});
