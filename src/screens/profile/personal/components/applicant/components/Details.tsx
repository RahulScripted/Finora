import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import type { Applicant } from "@data-types/personal/constants";
import type { UnmaskState } from "@hooks/useUnmaskField";
import FieldRow from "../../shared/contact-details/FieldRow";
import SectionLabel from "../../shared/contact-details/SectionLabel";
import { formatDob, formatAddress, maskAadhaar } from "@utils/format-locals";

type EditTarget = { field: string; label: string; value: string; target: "applicant" };

type Props = {
  applicant: Applicant;
  panState: UnmaskState;
  aadhaarState: UnmaskState;
  onUnmask: (field: "pan" | "aadhaar") => void;
  onMask: (field: "pan" | "aadhaar") => void;
  onEdit: (e: EditTarget) => void;
};

export default function Details({ applicant, panState, aadhaarState, onUnmask, onMask, onEdit }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <SectionLabel label={t("personal.section_contact")} />
      <View style={[s.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <FieldRow
          label={t("personal.field_mobile")}
          value={applicant.contact.mobile}
          verified={applicant.contact.mobileVerified}
          editable
          onEdit={() => onEdit({ field: "mobile", label: t("personal.field_mobile"), value: applicant.contact.mobile, target: "applicant" })}
        />
        <FieldRow
          label={t("personal.field_email")}
          value={applicant.contact.email}
          verified={applicant.contact.emailVerified}
          editable
          onEdit={() => onEdit({ field: "email", label: t("personal.field_email"), value: applicant.contact.email, target: "applicant" })}
        />
      </View>

      <SectionLabel label={t("personal.section_applicant_details")} />
      <View style={[s.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <FieldRow label={t("personal.field_full_name")} value={applicant.fullNameAsPerPan} />
        <FieldRow label={t("personal.field_dob")} value={formatDob(applicant.dateOfBirth)} />
        <FieldRow label={t("personal.field_gender")} value={t(`personal.gender_${applicant.gender}` as any)} />
        <FieldRow
          label={t("personal.field_pan")}
          value={applicant.pan}
          sensitive
          unmaskedValue={panState.value}
          isUnmasking={panState.isLoading}
          onUnmask={() => onUnmask("pan")}
          onMask={() => onMask("pan")}
        />
        <FieldRow
          label={t("personal.field_aadhaar")}
          value={maskAadhaar(applicant.aadhaarLast4)}
          sensitive
          unmaskedValue={aadhaarState.value}
          isUnmasking={aadhaarState.isLoading}
          onUnmask={() => onUnmask("aadhaar")}
          onMask={() => onMask("aadhaar")}
        />
        <FieldRow
          label={t("personal.field_address")}
          value={formatAddress(applicant.residentialAddress)}
          editable
          onEdit={() => onEdit({ field: "address", label: t("personal.field_address"), value: applicant.residentialAddress.line1, target: "applicant" })}
        />
        <FieldRow label={t("personal.field_relationship_business")} value={applicant.relationshipToBusiness} />
      </View>
    </>
  );
}

const s = StyleSheet.create({
  group: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, marginBottom: 20, overflow: "hidden" },
});
