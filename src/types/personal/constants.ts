export type KycStatus = "verified" | "pending" | "rejected";

export type ContactInfo = {
  mobile: string;
  mobileVerified: boolean;
  email: string;
  emailVerified: boolean;
};

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type Applicant = {
  id: string;
  role: "primary";
  relationshipToBusiness: string;
  kycStatus: KycStatus;
  avatarUrl: string | null;
  initials: string;
  fullNameAsPerPan: string;
  displayName: string;
  dateOfBirth: string;
  gender: string;
  pan: string;
  panLocked: boolean;
  aadhaarLast4: string;
  contact: ContactInfo;
  residentialAddress: Address;
  editableFields: string[];
  lockedFields: string[];
};

export type CoApplicant = {
  id: string;
  role: "co_applicant";
  relationshipToApplicant: string;
  kycStatus: KycStatus;
  avatarUrl: string | null;
  initials: string;
  fullNameAsPerPan: string;
  displayName: string;
  dateOfBirth: string;
  pan: string;
  panLocked: boolean;
  contact: ContactInfo;
  residentialAddress: Address;
  editableFields: string[];
  lockedFields: string[];
};

export type PersonalData = {
  applicant: Applicant;
  coApplicants: CoApplicant[];
  maxCoApplicants: number;
};
