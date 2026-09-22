import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { PrimaryButton } from "@helpers/button";
import { usePersonal } from "@hooks/usePersonal";
import { useUnmaskField } from "@hooks/useUnmaskField";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import AlertModal from "@helpers/model/AlertModal";
import VerifyContactSheet from "@helpers/model/VerifyContactSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ApplicantSection from "./components/applicant";
import AvatarPickerSheet from "./components/applicant/components/avatar";
import Card from "./components/coapplicant/components/Card";
import AddSheet from "./components/coapplicant/components/AddSheet";
import EditFieldSheet from "./components/shared/contact-details/EditFieldSheet";
import SectionLabel from "./components/shared/contact-details/SectionLabel";

type EditState = { field: string; label: string; value: string; target: "applicant" | string } | null;

export default function PersonalScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { data, updateApplicant, updateCoApplicant, addCoApplicant } = usePersonal();
  const { applicant, coApplicants, maxCoApplicants } = data;
  const { unmask, getState, clear } = useUnmaskField();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAddCo, setShowAddCo] = useState(false);
  const [editing, setEditing] = useState<EditState>(null);
  const [alert, setAlert] = useState<{ title: string; message: string; icon?: string } | null>(null);
  const [verify, setVerify] = useState<{ type: "mobile" | "email"; value: string } | null>(null);
  const [cameraPermModal, setCameraPermModal] = useState(false);
  const [galleryPermModal, setGalleryPermModal] = useState(false);

  const panState = getState(applicant.id, "pan");
  const aadhaarState = getState(applicant.id, "aadhaar");
  const canAddMore = coApplicants.length < maxCoApplicants;

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status === "undetermined") {
      setCameraPermModal(true);
      return;
    }
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, aspect: [1, 1] });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const launchCamera = async () => {
    setCameraPermModal(false);
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, aspect: [1, 1] });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status === "undetermined") {
      setGalleryPermModal(true);
      return;
    }
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const launchGallery = async () => {
    setGalleryPermModal(false);
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const handleSave = (value: string) => {
    if (!editing) return;
    const { field, target } = editing;
    if (target === "applicant") {
      if (field === "mobile") updateApplicant({ contact: { ...applicant.contact, mobile: value } });
      else if (field === "email") updateApplicant({ contact: { ...applicant.contact, email: value } });
      else if (field === "address") updateApplicant({ residentialAddress: { ...applicant.residentialAddress, line1: value } });
    } else {
      const co = coApplicants.find((c) => c.id === target);
      if (!co) return;
      if (field === "mobile") updateCoApplicant(target, { contact: { ...co.contact, mobile: value } });
      else if (field === "email") updateCoApplicant(target, { contact: { ...co.contact, email: value } });
      else if (field === "address") updateCoApplicant(target, { residentialAddress: { ...co.residentialAddress, line1: value } });
    }
    setEditing(null);
    setAlert({ title: t("personal.saved_alert_title"), message: t("personal.saved_alert_message"), icon: "success" });
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.headerWrap, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("personal.title")} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
      >
        <ApplicantSection
          applicant={applicant}
          avatarUri={avatarUri}
          panState={panState}
          aadhaarState={aadhaarState}
          onPressAvatar={() => setShowAvatarPicker(true)}
          onUnmask={(field) => unmask(applicant.id, field)}
          onMask={(field) => clear(applicant.id, field)}
          onEdit={setEditing}
        />

        {coApplicants.length > 0 && (
          <>
            <SectionLabel label={t("personal.section_coapplicants")} />
            {coApplicants.map((co) => (
              <Card
                key={co.id}
                co={co}
                panState={getState(co.id, "pan")}
                onNavigate={() => navigation.navigate("co-applicant-detail", { id: co.id })}
                onUnmask={() => unmask(co.id, "pan")}
                onMask={() => clear(co.id, "pan")}
                onEdit={setEditing}
                onVerifyMobile={() => setVerify({ type: "mobile", value: co.contact.mobile })}
                onVerifyEmail={() => setVerify({ type: "email", value: co.contact.email })}
              />
            ))}
          </>
        )}

        {canAddMore && (
          <PrimaryButton
            title={t("personal.add_coapplicant_button")}
            style={s.addBtn}
            onPress={() => setShowAddCo(true)}
          />
        )}
      </ScrollView>

      <AvatarPickerSheet
        visible={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        onPickCamera={pickFromCamera}
        onPickGallery={pickFromGallery}
      />

      <AddSheet
        visible={showAddCo}
        onClose={() => setShowAddCo(false)}
        onAdd={addCoApplicant}
      />

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

      {/* Camera permission modal */}
      <AlertModal
        visible={cameraPermModal}
        title="Allow camera access?"
        message="We'll use your camera only to update your profile photo. Nothing is uploaded without you tapping save."
        icon="camera-outline"
        buttons={[
          { text: "Not now", style: "cancel", onPress: () => setCameraPermModal(false) },
          { text: "Continue", onPress: launchCamera },
        ]}
        onClose={() => setCameraPermModal(false)}
      />

      {/* Gallery permission modal */}
      <AlertModal
        visible={galleryPermModal}
        title="Allow photo access?"
        message="We need access to your photo library to let you pick a profile picture."
        icon="image-outline"
        buttons={[
          { text: "Not now", style: "cancel", onPress: () => setGalleryPermModal(false) },
          { text: "Continue", onPress: launchGallery },
        ]}
        onClose={() => setGalleryPermModal(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  headerWrap: { paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  addBtn: { marginTop: 4 },
});
