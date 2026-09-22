import type { Applicant } from "@data-types/personal/constants";
import type { UnmaskState } from "@hooks/useUnmaskField";
import Hero from "./components/Hero";
import Details from "./components/Details";

export { Hero, Details };

type EditTarget = { field: string; label: string; value: string; target: "applicant" };

type Props = {
  applicant: Applicant;
  avatarUri: string | null;
  panState: UnmaskState;
  aadhaarState: UnmaskState;
  onPressAvatar: () => void;
  onUnmask: (field: "pan" | "aadhaar") => void;
  onMask: (field: "pan" | "aadhaar") => void;
  onEdit: (e: EditTarget) => void;
};

/** Full applicant section: hero + all detail rows. */
export default function ApplicantSection({
  applicant, avatarUri, panState, aadhaarState,
  onPressAvatar, onUnmask, onMask, onEdit,
}: Props) {
  return (
    <>
      <Hero
        initials={applicant.initials}
        displayName={applicant.displayName}
        kycStatus={applicant.kycStatus}
        avatarUri={avatarUri}
        onPressAvatar={onPressAvatar}
      />
      <Details
        applicant={applicant}
        panState={panState}
        aadhaarState={aadhaarState}
        onUnmask={onUnmask}
        onMask={onMask}
        onEdit={onEdit}
      />
    </>
  );
}
