export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type Registration = {
  gstin: string;
  gstinVerified: boolean;
  businessPan: string;
  udyamNumber: string | null;
  cin: string | null;
};

export type Banking = {
  accountHolderName: string;
  bankName: string;
  accountNumberLast4: string;
  ifsc: string;
  accountVerified: boolean;
};

export type AuthorizedSignatory = {
  applicantId: string;
  displayName: string;
  designation: string;
  mobile: string;
};

export type CompanyData = {
  id: string;
  legalName: string;
  displayName: string;
  businessType: string;
  industry: string;
  yearEstablished: number;
  logoUrl: string | null;
  registration: Registration;
  registeredAddress: Address;
  banking: Banking;
  authorizedSignatory: AuthorizedSignatory;
  editableFields: string[];
  lockedFields: string[];
};
