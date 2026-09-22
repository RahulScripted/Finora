import type { CompanyData } from "@data-types/company/constants";

export const COMPANY_MOCK: CompanyData = {
  id: "biz_3d8c71",
  legalName: "Goswami Textile Traders",
  displayName: "Goswami Textile Traders",
  businessType: "Proprietorship",
  industry: "Textiles & apparel",
  yearEstablished: 2019,
  logoUrl: null,
  registration: {
    gstin: "XXXXXXXXXX4F1Z5",
    gstinVerified: true,
    businessPan: "ABCPT1234F",
    udyamNumber: "UDYAM-MH-33-0041267",
    cin: null,
  },
  registeredAddress: {
    line1: "Shop 14, Kailash Industrial Estate",
    line2: "Bhandup West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400078",
    country: "IN",
  },
  banking: {
    accountHolderName: "Goswami Textile Traders",
    bankName: "HDFC Bank",
    accountNumberLast4: "4821",
    ifsc: "HDFC0000142",
    accountVerified: true,
  },
  authorizedSignatory: {
    applicantId: "usr_9f21a3",
    displayName: "Rahul Goswami",
    designation: "Proprietor",
    mobile: "+919820044521",
  },
  editableFields: ["industry", "registeredAddress", "logoUrl"],
  lockedFields: ["legalName", "businessType", "registration"],
};
