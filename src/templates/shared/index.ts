/**
 * Shared helpers + variable shape for message templates.
 * Channel-specific templates live in ../email and ../whatsapp.
 */

export type SupportTemplateVars = {
  customer_name?: string;
  registered_mobile?: string;
  company_name?: string;
  issue_type?: string;
  reference_id?: string;
  issue_description?: string;
  /** Screen / page the user was on (used by the error-report flow). */
  screen?: string;
  /** Raw error message (used by the error-report flow). */
  error_message?: string;
};

const DASH = "—";

/** Replaces {{token}} with the provided value, or a dash when missing. */
export function fillTemplate(template: string, vars: SupportTemplateVars): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = (vars as Record<string, string | undefined>)[key];
    return value && value.trim() ? value.trim() : DASH;
  });
}

/** Default customer identity used to pre-fill templates (from mock/profile). */
export const DEFAULT_CUSTOMER: SupportTemplateVars = {
  customer_name: "Rahul Goswami",
  registered_mobile: "+91 98330 11267",
  company_name: "Sunrise Traders Pvt. Ltd.",
};
