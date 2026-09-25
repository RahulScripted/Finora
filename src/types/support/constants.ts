export type SupportCategory = {
  id: string;
  label: string;
  subcategories: string[];
};

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type SupportTicket = {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  screenshotUri?: string;
  status: TicketStatus;
  createdAt: string;
};

export type ContactPerson = {
  name: string;
  role: string;
  email: string;
  mobile: string;
};

export type SupportData = {
  relationshipManager: ContactPerson;
  escalation: ContactPerson;
  whatsappNumber: string;
  whatsappHours: string;
  tickets: SupportTicket[];
};

export type ContactActionPayload = {
  type: "whatsapp" | "email";
  to: string;
  subject?: string;
  body: string;
  screenshotUri?: string;
};

export const TICKET_STATUS_CONFIG: Record<TicketStatus, { labelKey: string; color: string }> = {
  open: { labelKey: "support.status_open", color: "#3B61FF" },
  in_progress: { labelKey: "support.status_in_progress", color: "#FF9C01" },
  resolved: { labelKey: "support.status_resolved", color: "#12805C" },
  closed: { labelKey: "support.status_closed", color: "#6B7280" },
};

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: "loan",
    label: "Loan & Disbursement",
    subcategories: [
      "Disbursement Delay",
      "Disbursement Not Received",
      "Loan Amount Mismatch",
      "Partial Disbursement",
      "Disbursement Failed",
      "Loan Application Status",
      "Loan Eligibility",
      "Loan Sanction Letter",
      "Loan Agreement",
      "Loan Closure",
      "Foreclosure Request",
      "No Due Certificate (NDC)",
      "Interest Rate Query",
      "Processing Fee Query",
      "Other",
    ],
  },
  {
    id: "invoice",
    label: "Invoice Financing",
    subcategories: [
      "Invoice Upload Failed",
      "Invoice Submission Issue",
      "Invoice Verification Delay",
      "Invoice Rejected",
      "Invoice Rejection Reason",
      "Invoice Status",
      "Invoice Approval Delay",
      "Invoice Approved but Not Financed",
      "Invoice Financing Request",
      "Invoice Financing Limit",
      "Limit Utilisation",
      "Available Limit Mismatch",
      "Financed Amount Mismatch",
      "Invoice Amount Mismatch",
      "Duplicate Invoice",
      "Invoice Cancellation",
      "Invoice Modification",
      "Invoice Due Date",
      "Invoice Settlement",
      "Invoice Discounting Rate",
      "Invoice Financing Charges",
      "Other",
    ],
  },
  {
    id: "drawdown",
    label: "Drawdown & Payout",
    subcategories: [
      "Drawdown Request Failed",
      "Drawdown Pending",
      "Drawdown Approved but Not Received",
      "Drawdown Processing Delay",
      "Drawdown Rejected",
      "Drawdown Amount Mismatch",
      "Partial Drawdown",
      "Wrong Bank Account Credited",
      "Bank Transfer Failed",
      "Drawdown Status",
      "Drawdown Cancellation",
      "Drawdown Reference / UTR Query",
      "Multiple Drawdown Entries",
      "Other",
    ],
  },
  {
    id: "repayment",
    label: "Repayment & Collections",
    subcategories: [
      "Payment Not Reflected",
      "Payment Failed",
      "Payment Deducted but Not Updated",
      "Duplicate Payment",
      "Repayment Amount Mismatch",
      "Partial Repayment",
      "Repayment Schedule",
      "Upcoming Payment",
      "Repayment Due Date",
      "EMI Bounce",
      "Auto-Debit Failed",
      "Payment Link Issue",
      "Payment Gateway Issue",
      "Payment Receipt",
      "Payment Confirmation",
      "Repayment Allocation",
      "Excess Payment",
      "Refund Request",
      "Late Payment Charges",
      "Penal Interest Query",
      "Overdue Payment",
      "Prepayment Query",
      "Foreclosure Amount",
      "Other",
    ],
  },
  {
    id: "charges",
    label: "Interest, Fees & Charges",
    subcategories: [
      "Interest Rate Query",
      "Interest Calculation Mismatch",
      "Interest Amount Mismatch",
      "Interest Charged Incorrectly",
      "Interest Certificate Request",
      "Interest Statement Request",
      "Processing Fee Query",
      "Platform Fee Query",
      "Documentation Charges",
      "Late Payment Charges",
      "Penal Charges",
      "Additional Charges",
      "GST on Charges",
      "Fee Refund Request",
      "Charges Breakdown",
      "Other",
    ],
  },
  {
    id: "business_partner",
    label: "Business Partners & Anchor",
    subcategories: [
      "Add Business Partner",
      "Business Partner Not Listed",
      "Anchor Not Listed",
      "Anchor Onboarding",
      "Business Partner Approval",
      "Business Partner Verification",
      "Partner Relationship Issue",
      "Anchor Approval Pending",
      "Anchor Invoice Confirmation",
      "Anchor Payment Confirmation",
      "Anchor Limit Query",
      "Business Partner Details Incorrect",
      "Partner Code / ID Query",
      "Partner Agreement",
      "Partner Deactivation",
      "Other",
    ],
  },
  {
    id: "account",
    label: "Account & KYC",
    subcategories: [
      "KYC Update",
      "KYC Verification Pending",
      "KYC Rejected",
      "KYC Document Upload",
      "PAN Verification",
      "Business KYC",
      "GST Details Update",
      "Company Details Update",
      "Bank Account Change",
      "Bank Account Verification",
      "IFSC / Account Number Mismatch",
      "Profile Update",
      "Registered Mobile Number Change",
      "Registered Email Change",
      "Authorized Signatory Update",
      "Director / Partner Details Update",
      "Account Activation",
      "Account Deactivation",
      "Account Closure",
      "Other",
    ],
  },
  {
    id: "documents",
    label: "Documents & Certificates",
    subcategories: [
      "Invoice Copy",
      "Loan Statement",
      "Account Statement",
      "Repayment Statement",
      "Interest Certificate",
      "No Due Certificate (NDC)",
      "Loan Closure Letter",
      "Sanction Letter",
      "Loan Agreement Copy",
      "Financing Agreement",
      "Payment Receipt",
      "Repayment Receipt",
      "Tax / GST Certificate",
      "Document Download Failed",
      "Document Not Available",
      "Incorrect Document Details",
      "Document Verification",
      "Document Request Status",
      "Other",
    ],
  },
  {
    id: "nach",
    label: "NACH & Mandates",
    subcategories: [
      "NACH Registration",
      "NACH Registration Failed",
      "Mandate Pending",
      "Mandate Rejected",
      "Mandate Not Active",
      "Mandate Status",
      "Mandate Amount Mismatch",
      "Incorrect Auto-Debit",
      "Unrecognized Auto-Debit",
      "Multiple Auto-Debits",
      "NACH Cancellation Request",
      "Mandate Cancellation Pending",
      "Mandate Cancellation Confirmation",
      "Bank Account Mandate Update",
      "Other",
    ],
  },
  {
    id: "service_request",
    label: "Service Requests & Complaints",
    subcategories: [
      "Existing Request Status",
      "Request Pending",
      "Request Resolution Delay",
      "Request Rejected",
      "Request Cancellation",
      "Request Details Incorrect",
      "Complaint Registration",
      "Complaint Escalation",
      "Grievance Redressal",
      "Service Experience Feedback",
      "Other",
    ],
  },
  {
    id: "technical",
    label: "Technical & App Issues",
    subcategories: [
      "App Crash",
      "App Not Opening",
      "Login Problem",
      "Unable to Register",
      "OTP Not Received",
      "OTP Verification Failed",
      "MPIN Issue",
      "Biometric Login Issue",
      "Forgot MPIN",
      "Session Expired",
      "Unable to Access Dashboard",
      "Screen Not Loading",
      "Button Not Working",
      "Invoice Upload Error",
      "File Upload Failed",
      "Document Download Failed",
      "Payment Page Not Loading",
      "Slow App Performance",
      "App Update Issue",
      "Other",
    ],
  },
  {
    id: "security",
    label: "Security & Access",
    subcategories: [
      "Suspicious Account Activity",
      "Unauthorized Transaction",
      "Unknown Payment Deduction",
      "Unknown Login",
      "Account Compromised",
      "Lost / Stolen Device",
      "Account Locked",
      "Unable to Access Account",
      "Registered Device Change",
      "Session / Device Management",
      "Data Privacy Concern",
      "Personal Information Concern",
      "Other",
    ],
  },
  {
    id: "notifications",
    label: "Notifications & Communication",
    subcategories: [
      "Payment Notification Not Received",
      "Invoice Notification Not Received",
      "Drawdown Notification Not Received",
      "Repayment Reminder Issue",
      "Incorrect Notification",
      "Duplicate Notifications",
      "Email Not Received",
      "SMS Not Received",
      "WhatsApp Notification Issue",
      "Incorrect Contact Details",
      "Notification Preferences",
      "Other",
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    subcategories: [
      "Dashboard Data Mismatch",
      "Outstanding Amount Mismatch",
      "Drawdown Report",
      "Repayment Report",
      "Interest Report",
      "Invoice Report",
      "Business Partner Report",
      "Credit Limit Report",
      "Transaction History",
      "Report Download Failed",
      "Export to Excel / PDF",
      "Other",
    ],
  },
  {
    id: "other",
    label: "Other Queries",
    subcategories: [
      "General Enquiry",
      "Product Information",
      "Eligibility Enquiry",
      "Feedback",
      "Suggestion",
      "Other",
    ],
  },
];
