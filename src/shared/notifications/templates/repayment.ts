type Template = { title: string; body: string };

const REMINDER_POOL: ((amt: string, date: string) => Template)[] = [
  (amt, date) => ({ title: "Repayment due soon", body: `₹${amt} due on ${date}. Pay early, protect your credit line.` }),
  (amt, date) => ({ title: "Heads up", body: `₹${amt} repayment on ${date}. One tap keeps your limit intact.` }),
  (amt, date) => ({ title: "Gentle reminder", body: `Your ₹${amt} is due ${date}. On-time payments = better rates next time.` }),
  (amt, date) => ({ title: "Due date approaching", body: `₹${amt} due ${date}. Early repayment keeps your credit score clean.` }),
  (amt, date) => ({ title: "Streak on the line", body: `₹${amt} due ${date}. Don't break your perfect repayment record.` }),
  (amt, date) => ({ title: "Repayment alert", body: `₹${amt} due on ${date}. Settle it early — your limit resets faster.` }),
  (amt, date) => ({ title: "Stay on track", body: `₹${amt} due ${date}. Consistent repayments unlock higher credit limits.` }),
  (amt, date) => ({ title: "Plan ahead", body: `₹${amt} due ${date}. Schedule it now so your cash flow stays smooth.` }),
  (amt, date) => ({ title: "Protect your rating", body: `₹${amt} due ${date}. Top borrowers never miss — you know which tier you're in.` }),
  (amt, date) => ({ title: "Green light ahead", body: `Pay ₹${amt} by ${date} and your credit line stays wide open.` }),
];

const OVERDUE_POOL: ((amt: string) => Template)[] = [
  (amt) => ({ title: `Overdue: ₹${amt}`, body: "Your repayment is past due. Settle now to avoid late charges and protect your limit." }),
  (amt) => ({ title: "Action needed", body: `₹${amt} is overdue. Pay immediately to restore your credit line and avoid penalties.` }),
  (amt) => ({ title: "Repayment overdue", body: `₹${amt} past due. Every day adds to the cost — clear it now.` }),
  (amt) => ({ title: "Urgent: payment due", body: `₹${amt} overdue. Your credit limit is on hold until this is cleared.` }),
];

const SUCCESS_POOL: ((amt: string) => Template)[] = [
  (amt) => ({ title: "Repayment received", body: `₹${amt} cleared. Your credit line is refreshed and ready for the next invoice.` }),
  (amt) => ({ title: "Payment confirmed", body: `₹${amt} settled. Clean books, open limit — keep the momentum going.` }),
  (amt) => ({ title: "Cleared", body: `₹${amt} repaid. Your limit is back in full. Time to fund the next deal.` }),
  (amt) => ({ title: "On-time payment", body: `₹${amt} received on time. Your repayment score just got stronger.` }),
  (amt) => ({ title: "Limit restored", body: `₹${amt} cleared. Full credit line available — go fund your next invoice.` }),
  (amt) => ({ title: "Credit refreshed", body: `₹${amt} repaid. Your working capital cycle is running perfectly.` }),
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getRepaymentReminderNotification = (amount: string, dueDate: string): Template =>
  pick(REMINDER_POOL)(amount, dueDate);

export const getOverdueNotification = (amount: string): Template =>
  pick(OVERDUE_POOL)(amount);

export const getRepaymentSuccessNotification = (amount: string): Template =>
  pick(SUCCESS_POOL)(amount);
