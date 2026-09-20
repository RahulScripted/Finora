/**
 * Common Finora support contact details.
 * Shared across all screens so the values live in a single place.
 */
export const CONTACT_SUPPORT_EMAIL = "support@finora.example";
export const CONTACT_SUPPORT_PHONE = "+91-98830 67644";

export type ContactRow = {
  icon: string;
  label: string;
  href: string;
};

/** Ready-to-render support contact rows (email + phone). */
export const SUPPORT_CONTACTS: ContactRow[] = [
  {
    icon: "email-outline",
    label: CONTACT_SUPPORT_EMAIL,
    href: `mailto:${CONTACT_SUPPORT_EMAIL}`,
  },
  {
    icon: "phone-outline",
    label: CONTACT_SUPPORT_PHONE,
    href: `tel:${CONTACT_SUPPORT_PHONE}`,
  },
];
