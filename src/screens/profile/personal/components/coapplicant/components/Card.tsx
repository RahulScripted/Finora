import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CoApplicant } from "@data-types/personal/constants";
import type { UnmaskState } from "@hooks/useUnmaskField";
import FieldRow from "../../shared/contact-details/FieldRow";

type EditTarget = { field: string; label: string; value: string; target: string };

type Props = {
  co: CoApplicant;
  panState: UnmaskState;
  onNavigate: () => void;
  onUnmask: () => void;
  onMask: () => void;
  onEdit: (e: EditTarget) => void;
  onVerifyMobile: () => void;
  onVerifyEmail: () => void;
};

export default function Card({ co, panState, onNavigate, onUnmask, onMask, onEdit, onVerifyMobile, onVerifyEmail }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const coVerified = co.kycStatus === "verified";

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable
        style={({ pressed }) => [s.profile, { opacity: pressed ? 0.7 : 1 }]}
        onPress={onNavigate}
      >
        <View style={[s.avatar, { backgroundColor: "#588FB5" }]}>
          <Text style={s.initials}>{co.initials}</Text>
        </View>
        <View style={s.meta}>
          <Text style={[s.name, { color: colors.textPrimary }]}>{co.displayName}</Text>
          <Text style={[s.role, { color: colors.textSecondary }]}>
            {t("personal.co_applicant")} · {co.relationshipToApplicant}
          </Text>
        </View>
        <View style={[s.kyc, { backgroundColor: coVerified ? colors.successSoft : colors.warningSoft }]}>
          <MaterialCommunityIcons
            name={coVerified ? "check-circle" : "clock-outline"}
            size={11}
            color={coVerified ? colors.success : colors.warning}
          />
          <Text style={[s.kycText, { color: coVerified ? colors.success : colors.warning }]}>
            {coVerified ? t("personal.kyc_verified") : t("personal.kyc_pending")}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} style={{ marginLeft: 2 }} />
      </Pressable>

      <FieldRow
        label={t("personal.field_mobile")}
        value={co.contact.mobile}
        verified={co.contact.mobileVerified}
        unverified={!co.contact.mobileVerified}
        onVerify={() => onVerifyMobile()}
      />
      <FieldRow
        label={t("personal.field_email")}
        value={co.contact.email}
        verified={co.contact.emailVerified}
        unverified={!co.contact.emailVerified}
        onVerify={() => onVerifyEmail()}
      />
      <FieldRow
        label={t("personal.field_pan")}
        value={co.pan}
        sensitive
        unmaskedValue={panState.value}
        isUnmasking={panState.isLoading}
        onUnmask={onUnmask}
        onMask={onMask}
      />
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, marginBottom: 16, overflow: "hidden" },
  profile: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 14, paddingHorizontal: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  initials: { color: "#fff", fontSize: 16, fontWeight: "700" },
  meta: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600" },
  role: { fontSize: 12, marginTop: 2 },
  kyc: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  kycText: { fontSize: 10, fontWeight: "600" },
});
