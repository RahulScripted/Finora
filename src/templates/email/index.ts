/**
 * Email templates — written from the customer's perspective to report an
 * issue to Finora. Placeholders use {{token}} syntax (see ../shared).
 */
import { fillTemplate, type SupportTemplateVars } from "../shared";

export const EMAIL_SUBJECT = "Support Request – {{issue_type}} – {{customer_name}}";

export const EMAIL_BODY = `Dear Finora Support Team,

I am writing to report an issue I am experiencing while using the Finora application.

My Details:
Name: {{customer_name}}
Registered Mobile Number: {{registered_mobile}}
Company Name: {{company_name}}
Issue Category: {{issue_type}}
Invoice / Transaction ID (if applicable): {{reference_id}}

Issue Description:
{{issue_description}}

I kindly request your team to look into this matter and help me resolve the issue at the earliest.
Please let me know if you require any additional information or documents from my side.
I would appreciate an update once the issue has been reviewed and resolved.

Thank you for your assistance.

Regards,
{{customer_name}}
{{company_name}}
{{registered_mobile}}`;

/** Auto-filled error report (used when something breaks in the app). */
export const ERROR_REPORT_SUBJECT = "App issue report – {{screen}}";

export const ERROR_REPORT_BODY = `Hi Finora Support Team,

I ran into a problem while using the Finora app. Details below (auto-filled):

Name: {{customer_name}}
Registered Mobile: {{registered_mobile}}
Company: {{company_name}}
Where: {{screen}}
What happened: {{error_message}}

Issue Description:
{{issue_description}}

Could you please look into this and help me resolve it?

Thank you.`;

export function buildEmail(vars: SupportTemplateVars) {
  return {
    subject: fillTemplate(EMAIL_SUBJECT, vars),
    body: fillTemplate(EMAIL_BODY, vars),
  };
}

export function buildErrorReport(vars: SupportTemplateVars) {
  return {
    subject: fillTemplate(ERROR_REPORT_SUBJECT, vars),
    body: fillTemplate(ERROR_REPORT_BODY, vars),
  };
}
