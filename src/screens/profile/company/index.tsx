import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCompany } from "@hooks/useCompany";
import { useUnmaskField } from "@hooks/useUnmaskField";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AlertModal from "@helpers/model/AlertModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CompanyHero from "./components/CompanyHero";
import FieldRow from "./components/shared/FieldRow";
import SectionLabel from "./components/shared/SectionLabel";
import EditSheet from "./components/shared/EditSheet";
import { formatAddress } from "@utils/format-locals";

type EditState = { field: string; label: string; value: string } | null;

export default function CompanyScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, updateCompany } = useCompany();
  const { unmask, getState, clear } = useUnmaskField();

  const [editing, setEditing] = useState<EditState>(null);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);

  const isEditable = (field: string) => data.editableFields.includes(field);
  const gstinState = getState(data.id, "gstin");

  const handleSave = (value: string) => {
    if (!editing) return;
    if (editing.field === "industry") updateCompany({ industry: value });
    else if (editing.field === "address") updateCompany({ registeredAddress: { ...data.registeredAddress, line1: value } });
    setEditing(null);
    setAlert({ title: t("company.saved_alert_title"), message: t("company.saved_alert_message") });
  };

  const initials = data.displayName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.headerWrap, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("company.title")} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
      >
        <CompanyHero
          displayName={data.displayName}
          businessType={data.businessType}
          yearEstablished={data.yearEstablished}
        />

        {/* Registration */}
        <SectionLabel label={t("company.section_registration")} />
        <View style={[s.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FieldRow label={t("company.field_business_type")} value={data.businessType} />
          <FieldRow
            label={t("company.field_gstin")}
            value={data.registration.gstin}
            verified={data.registration.gstinVerified}
            sensitive
            unmaskedValue={gstinState.value}
            isUnmasking={gstinState.isLoading}
            onUnmask={() => unmask(data.id, "gstin")}
            onMask={() => clear(data.id, "gstin")}
          />
          <FieldRow label={t("company.field_pan")} value={data.registration.businessPan} />
          {data.registration.udyamNumber ? (
            <FieldRow label={t("company.field_udyam")} value={data.registration.udyamNumber} />
          ) : null}
          <FieldRow
            label={t("company.field_industry")}
            value={data.industry}
            editable={isEditable("industry")}
            onEdit={() => setEditing({ field: "industry", label: t("company.field_industry"), value: data.industry })}
          />
        </View>

        {/* Address */}
        <SectionLabel label={t("company.section_address")} />
        <View style={[s.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FieldRow
            label={t("company.field_address")}
            value={formatAddress(data.registeredAddress)}
            editable={isEditable("registeredAddress")}
            onEdit={() => setEditing({ field: "address", label: t("company.field_address"), value: data.registeredAddress.line1 })}
          />
          <FieldRow label={t("company.field_state")} value={data.registeredAddress.state} />
        </View>

        {/* Banking */}
        <SectionLabel label={t("company.section_banking")} />
        <View style={[s.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FieldRow
            label={t("company.field_bank_account")}
            value={`${data.banking.bankName} •••• ${data.banking.accountNumberLast4}`}
            verified={data.banking.accountVerified}
          />
          <FieldRow label={t("company.field_ifsc")} value={data.banking.ifsc} />
        </View>

        {/* Signatory */}
        <SectionLabel label={t("company.section_signatory")} />
        <View style={[s.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[s.sigRow, { borderBottomColor: colors.divider }]}>
            <View style={[s.sigAvatar, { backgroundColor: colors.accent }]}>
              <Text style={s.sigInitials}>{initials}</Text>
            </View>
            <View style={s.sigText}>
              <Text style={[s.sigName, { color: colors.textPrimary }]}>{data.authorizedSignatory.displayName}</Text>
              <Text style={[s.sigMeta, { color: colors.textSecondary }]}>
                {data.authorizedSignatory.designation} | {data.authorizedSignatory.mobile}
              </Text>
            </View>
            <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.textMuted} />
          </View>
        </View>
      </ScrollView>

      <EditSheet
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
        icon="success"
        onClose={() => setAlert(null)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  headerWrap: { paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  group: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, marginBottom: 20, overflow: "hidden" },
  sigRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  sigAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  sigInitials: { color: "#fff", fontSize: 14, fontWeight: "700" },
  sigText: { flex: 1 },
  sigName: { fontSize: 14, fontWeight: "600" },
  sigMeta: { fontSize: 12, marginTop: 2 },
});
