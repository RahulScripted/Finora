import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import BottomSheet from "@helpers/model";
import AlertModal from "@helpers/model/AlertModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { CoApplicant } from "@data-types/personal/constants";
import SectionLabel from "../../shared/contact-details/SectionLabel";
import { getPersonInitials } from "@utils/format-locals";

type NewCoForm = {
  fullName: string; dob: string; pan: string; mobile: string;
  email: string; addressLine1: string; city: string; state: string;
  pincode: string; relationship: string;
};

const EMPTY: NewCoForm = {
  fullName: "", dob: "", pan: "", mobile: "",
  email: "", addressLine1: "", city: "", state: "",
  pincode: "", relationship: "",
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (co: CoApplicant) => void;
};

export default function AddSheet({ visible, onClose, onAdd }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [form, setForm] = useState<NewCoForm>(EMPTY);
  const [validationAlert, setValidationAlert] = useState(false);
  const set = (k: keyof NewCoForm) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.fullName.trim() || !form.mobile.trim()) {
      setValidationAlert(true);
      return;
    }
    onAdd({
      id: `co_${Date.now()}`,
      role: "co_applicant",
      relationshipToApplicant: form.relationship || "—",
      kycStatus: "pending",
      avatarUrl: null,
      initials: getPersonInitials(form.fullName),
      fullNameAsPerPan: form.fullName,
      displayName: form.fullName,
      dateOfBirth: form.dob,
      pan: form.pan || "PENDING",
      panLocked: true,
      contact: { mobile: form.mobile, mobileVerified: false, email: form.email, emailVerified: false },
      residentialAddress: {
        line1: form.addressLine1, city: form.city,
        state: form.state, pincode: form.pincode, country: "IN",
      },
      editableFields: ["mobile", "email", "residentialAddress"],
      lockedFields: ["fullNameAsPerPan", "dateOfBirth", "pan"],
    });
    setForm(EMPTY);
    onClose();
  };

  const F = ({ label, fkey, ph, kb }: { label: string; fkey: keyof NewCoForm; ph?: string; kb?: any }) => (
    <View style={[s.field, { borderBottomColor: colors.divider }]}>
      <Text style={[s.flabel, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        style={[s.finput, { color: colors.textPrimary }]}
        value={form[fkey]}
        onChangeText={set(fkey)}
        placeholder={ph ?? label}
        placeholderTextColor={colors.placeholder}
        keyboardType={kb ?? "default"}
      />
    </View>
  );

  return (
    <>
      <BottomSheet
        visible={visible}
        onClose={() => { setForm(EMPTY); onClose(); }}
        title={t("personal.add_coapplicant_title")}
        footer={<PrimaryButton title={t("personal.add_coapplicant_button")} onPress={submit} />}
      >
        <View style={[s.notice, { backgroundColor: colors.infoSoft }]}>
          <MaterialCommunityIcons name="information-outline" size={15} color={colors.info} />
          <Text style={[s.noticeText, { color: colors.textSecondary }]}>
            {t("personal.add_coapplicant_notice")}
          </Text>
        </View>

        <SectionLabel label="Personal details" />
        <View style={[s.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <F label="Full name (as per PAN)" fkey="fullName" ph="e.g. Priya Sharma" />
          <F label="Date of birth" fkey="dob" ph="DD/MM/YYYY" />
          <F label="PAN" fkey="pan" ph="ABCDE1234F" />
          <F label="Relationship to you" fkey="relationship" ph="e.g. Spouse, Partner" />
        </View>

        <SectionLabel label="Contact" />
        <View style={[s.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <F label="Mobile number" fkey="mobile" ph="+91..." kb="phone-pad" />
          <F label="Email address" fkey="email" ph="name@email.com" kb="email-address" />
        </View>

        <SectionLabel label="Address" />
        <View style={[s.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <F label="Address line 1" fkey="addressLine1" ph="Building, street" />
          <F label="City" fkey="city" ph="Mumbai" />
          <F label="State" fkey="state" ph="Maharashtra" />
          <F label="Pincode" fkey="pincode" ph="400001" kb="number-pad" />
        </View>
      </BottomSheet>

      <AlertModal
        visible={validationAlert}
        title={t("personal.add_coapplicant_required_title")}
        message={t("personal.add_coapplicant_required")}
        icon="alert-circle-outline"
        iconColor={colors.danger}
        onClose={() => setValidationAlert(false)}
      />
    </>
  );
}

const s = StyleSheet.create({
  notice: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 12, padding: 12, marginBottom: 14 },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 18 },
  group: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, overflow: "hidden", marginBottom: 12 },
  field: { borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 12, paddingHorizontal: 16 },
  flabel: { fontSize: 11, marginBottom: 4 },
  finput: { fontSize: 15, fontWeight: "500", padding: 0 },
});
