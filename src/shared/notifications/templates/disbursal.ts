type Template = { title: string; body: string };
type Fn = (amt: string, ref?: string) => Template;

const POOL: Fn[] = [
  (amt, ref) => ({ title: "Funds disbursed", body: `₹${amt} released for Invoice ${ref}. Your working capital just got a boost.` }),
  (amt, ref) => ({ title: "Money's moving", body: `₹${amt} on its way — Invoice ${ref} funded. Keep the invoices coming.` }),
  (amt, ref) => ({ title: "Invoice funded", body: `₹${amt} approved for ${ref}. Cash flow: healthy. Business: unstoppable.` }),
  (amt, ref) => ({ title: "Capital unlocked", body: `₹${amt} disbursed against ${ref}. Put it to work immediately.` }),
  (amt, ref) => ({ title: "Instant disbursal", body: `₹${amt} credited for Invoice ${ref}. That's the speed your business deserves.` }),
  (amt, ref) => ({ title: "Funds released", body: `₹${amt} cleared for ${ref}. Your invoice just became working capital.` }),
  (amt, ref) => ({ title: "Cash flow boosted", body: `₹${amt} in for Invoice ${ref}. Reinvest, restock, repeat.` }),
  (amt, ref) => ({ title: "Funded on target", body: `₹${amt} disbursed — ${ref}. Precision financing, every time.` }),
  (amt, ref) => ({ title: "Limit utilised", body: `₹${amt} drawn for Invoice ${ref}. Smart use of your credit line.` }),
  (amt, ref) => ({ title: "Capital incoming", body: `₹${amt} flowing in for ${ref}. Ride it into your next order cycle.` }),
];

export function getDisbursalNotification(amount: string, reference = "your invoice"): Template {
  return POOL[Math.floor(Math.random() * POOL.length)](amount, reference);
}
