type Template = { title: string; body: string };

const POOL: ((amt: string) => Template)[] = [
  (amt) => ({ title: "Limit upgraded", body: `Your credit line is now ₹${amt}. More capital, more invoices, more growth.` }),
  (amt) => ({ title: "Credit line expanded", body: `₹${amt} available now. Your repayment history earned this.` }),
  (amt) => ({ title: `New limit: ₹${amt}`, body: "Your track record unlocked a higher credit line. Use it wisely." }),
  (amt) => ({ title: "Limit increased", body: `₹${amt} credit line active. Fund bigger invoices, grow faster.` }),
];

export function getLimitUpdateNotification(amount: string): Template {
  return POOL[Math.floor(Math.random() * POOL.length)](amount);
}
