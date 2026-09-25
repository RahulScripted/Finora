/**
 * WhatsApp templates — written from the customer's perspective to report an
 * issue to Finora. Placeholders use {{token}} syntax (see ../shared).
 */
import { fillTemplate, type SupportTemplateVars } from "../shared";

export const WHATSAPP_BODY = `Hi Finora Support Team,

I'm facing an issue while using the Finora app and need your assistance.

My Details:
Name: {{customer_name}}
Company: {{company_name}}
Registered Mobile: {{registered_mobile}}

Issue Category: {{issue_type}}
Invoice / Transaction ID: {{reference_id}}

Issue Description:
{{issue_description}}

Could you please look into this issue and help me resolve it at the earliest?
Please let me know if you need any additional details from my side.

Thank you.`;

/** Auto-filled error report for WhatsApp (used when something breaks). */
export const WHATSAPP_ERROR_BODY = `Hi Finora Support Team,

I ran into a problem while using the Finora app.

Name: {{customer_name}}
Company: {{company_name}}
Registered Mobile: {{registered_mobile}}
Where: {{screen}}
What happened: {{error_message}}

Could you please look into this and help me resolve it?

Thank you.`;

/** Example — Invoice drawdown issue (reference for copy). */
export const EXAMPLE_DRAWDOWN = `Hi Finora Support Team,

I'm facing an issue with the drawdown process for one of my invoices.

Company: Sunrise Traders Pvt. Ltd.
Invoice Number: INV-001234
Issue: My invoice has been approved, but the drawdown amount has not been credited to my account.

Could you please check the status and help me understand when the amount will be credited?
Please let me know if you need any additional information.

Thank you.`;

export function buildWhatsApp(vars: SupportTemplateVars) {
  return fillTemplate(WHATSAPP_BODY, vars);
}

export function buildWhatsAppError(vars: SupportTemplateVars) {
  return fillTemplate(WHATSAPP_ERROR_BODY, vars);
}
