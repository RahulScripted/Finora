import type { SupportData } from "@data-types/support/constants";

export const SUPPORT_MOCK: SupportData = {
  relationshipManager: {
    name: "Anjali Kulkarni",
    role: "Relationship Manager",
    email: "anjali.kulkarni@finora.in",
    mobile: "+91 98200 55310",
  },
  escalation: {
    name: "Vikram Shah",
    role: "Escalation Desk",
    email: "escalations@finora.in",
    mobile: "+91 90041 17001",
  },
  whatsappNumber: "919004117000",
  whatsappHours: "9:00 am to 6:00 pm, Mon to Sat",
  tickets: [
    {
      id: "TKT-1056",
      category: "Drawdown & Payout",
      subcategory: "Drawdown Pending",
      description: "My drawdown request of ₹3,20,000 is still pending after 2 days.",
      status: "open",
      createdAt: "2026-09-24T08:45:00Z",
    },
    {
      id: "TKT-1042",
      category: "Repayment",
      subcategory: "Payment Not Reflected",
      description: "My repayment of ₹50,000 made on 20 Sep is not reflected in the app.",
      status: "in_progress",
      createdAt: "2026-09-20T10:30:00Z",
    },
    {
      id: "TKT-1031",
      category: "Invoice Financing",
      subcategory: "Invoice Rejection",
      description: "Invoice INV-2044 was rejected without a clear reason.",
      status: "resolved",
      createdAt: "2026-09-10T14:00:00Z",
    },
    {
      id: "TKT-1018",
      category: "Account & KYC",
      subcategory: "Bank Account Change",
      description: "Need to update the bank account linked to my loan account.",
      status: "closed",
      createdAt: "2026-08-28T09:15:00Z",
    },
  ],
};
