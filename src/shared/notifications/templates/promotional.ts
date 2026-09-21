type Template = { title: string; body: string };

const POOL: Template[] = [
  { title: "Offer just for you", body: "Based on your repayment history, you've unlocked a preferential rate. Check it now." },
  { title: "Limited time offer", body: "Zero processing fee on your next invoice funding. Valid for 48 hours only." },
  { title: "New feature live", body: "Track your spend by category, invoice, and client — all in one view. Try it now." },
  { title: "Top borrower perk", body: "You're in our top 5% for repayment discipline. An exclusive offer is waiting." },
  { title: "Rate drop alert", body: "Interest rates just reduced. Your next funding could cost less — see how much." },
  { title: "Refer & earn", body: "Refer a business owner, earn ₹750 when they get funded. Share the advantage." },
  { title: "Pre-approved offer", body: "A working capital offer calculated from your exact profile is ready. No guesswork." },
  { title: "Festival offer", body: "Zero processing fee this week. Fund your festive season inventory now." },
];

export function getPromotionalNotification(): Template {
  return POOL[Math.floor(Math.random() * POOL.length)];
}
