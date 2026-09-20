export type ProfileMenuItem = {
  icon: string;
  label: string;
  subtitle: string;
  color: string;
  route: string;
};

export type ProfileMenuSection = {
  title: string;
  items: ProfileMenuItem[];
};

export const PROFILE_SECTIONS: ProfileMenuSection[] = [
  {
    title: "",
    items: [
      { icon: "account-outline", label: "Personal", subtitle: "Your personal details", color: "#3B61FF", route: "personal" },
      { icon: "office-building-outline", label: "Company", subtitle: "Business information", color: "#588FB5", route: "company" },
      { icon: "file-document-outline", label: "Documents", subtitle: "Uploaded documents", color: "#666BA5", route: "documents" },
      { icon: "cog-outline", label: "Settings", subtitle: "App preferences", color: "#E99A24", route: "settings" },
    ],
  },
  {
    title: "Policies",
    items: [
      { icon: "shield-check-outline", label: "Privacy Policy", subtitle: "How we handle your data", color: "#588FB5", route: "privacy-policy" },
      { icon: "file-sign", label: "Terms & Conditions", subtitle: "Terms of service", color: "#666BA5", route: "terms-conditions" },
      { icon: "cash-refund", label: "Refund & Cancellation", subtitle: "Refund policy details", color: "#16A477", route: "refund-cancellation" },
    ],
  },
  {
    title: "Benefits",
    items: [
      { icon: "bank-minus", label: "NACH Cancellation Request", subtitle: "Cancel your NACH mandate", color: "#E99A24", route: "nach-cancellation" },
      { icon: "certificate-outline", label: "NDC Certificate Request", subtitle: "No dues certificate", color: "#3B61FF", route: "ndc-certificate" },
      { icon: "card-account-phone-outline", label: "Update Contact Details", subtitle: "Keep your contact info current", color: "#16A477", route: "update-contact" },
    ],
  },
];
