export const PRIVACY_LAST_UPDATED = "21-09-2026";
export const PRIVACY_COMPANY_NAME = "Finora";
export const PRIVACY_PRIVACY_EMAIL = "privacy@finora.example";
export const PRIVACY_REGISTERED_ADDRESS =
  "123 Finance Street, Andheri (East), Mumbai 400001";

export const PRIVACY_SECTION_KEYS = [
  "info_collected",
  "location",
  "how_we_use",
  "how_we_share",
  "cookies",
  "data_security",
  "data_retention",
  "your_rights",
  "third_party",
  "childrens",
  "changes",
] as const;

export type PrivacySectionKey = (typeof PRIVACY_SECTION_KEYS)[number];

export const TERMS_LAST_UPDATED = "21-09-2026";
export const TERMS_SECTION_KEYS = [
  "intro",
  "applicant_declaration",
  "facility_grant",
  "accuracy",
  "disclosure_consent",
  "co_lending_consent",
  "uidai",
  "acceptance",
] as const;

export type TermsSectionKey = (typeof TERMS_SECTION_KEYS)[number];

export const REFUND_LAST_UPDATED = "21-09-2026";
export const REFUND_SECTION_KEYS = [
  "general",
  "failed",
  "duplicate",
  "requests",
  "processing",
  "cancellation",
  "non_refundable",
  "payment_failures",
  "provider_processing",
  "verification",
  "changes_payment",
  "policy_updates",
  "contact",
] as const;

export type RefundSectionKey = (typeof REFUND_SECTION_KEYS)[number];

export const CONTACT_SECTION_KEYS = [
  "why_important",
  "communication",
  "security",
  "opportunities",
  "reach_us",
  "request_update",
  "self_service",
] as const;

export type ContactSectionKey = (typeof CONTACT_SECTION_KEYS)[number];
