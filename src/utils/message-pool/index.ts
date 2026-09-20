// ─── Error Fallback ───
export const ERROR_TITLES = [
  "Oops, we fumbled that one",
  "Well, that's embarrassing — our fault",
  "We hit an unexpected wall",
  "Something broke on our end",
  "This one's on us",
];

export const ERROR_DESCRIPTIONS = [
  "Oops, we fumbled that one. Tap retry — it works 9/10 times.",
  "This section crashed on our end, not yours. Give it one more try!",
  "Something broke in the background. We've logged it. Please retry.",
  "Our app tripped — completely on us. One retry usually fixes it.",
  "We hit an unexpected wall. Nothing on your side — just hit retry.",
];

// ─── Network Lost ───
export const NETWORK_TITLES = [
  "You're offline right now",
  "No internet detected",
  "Looks like you've gone off-grid",
  "Can't reach the internet",
  "Where did the signal go?",
];

export const NETWORK_DESCRIPTIONS = [
  "You're offline right now — your data is safe, nothing was lost.",
  "No internet detected. Your account is untouched — reconnect and carry on.",
  "Looks like you're off the grid. Check Wi-Fi or mobile data and we'll load right up.",
  "Can't reach the internet right now. Nothing was lost — just reconnect!",
  "Signal lost. Your account is safe — flip Wi-Fi or data back on to continue.",
];

// ─── SOA — No Accounts ───
export const SOA_EMPTY_TITLES = [
  "No accounts linked yet",
  "Nothing here yet",
  "Your accounts will appear here",
  "No SOA data available yet",
];

export const SOA_EMPTY_DESCRIPTIONS = [
  "Your Statement of Accounts will live here once your accounts are linked.",
  "No accounts connected. Once set up, everything shows here in real time.",
  "Nothing here yet — accounts appear automatically once they're active.",
  "SOA data will show up here as soon as your accounts are ready.",
];

// ─── SOA Detail — No Transactions ───
export const SOA_NO_TX_TITLES = [
  "All quiet this period",
  "No activity recorded here",
  "Nothing moved in or out",
  "Clean slate this period",
];

export const SOA_NO_TX_DESCRIPTIONS = [
  "All quiet this period — no money moved in or out.",
  "Nothing recorded here. Try a different date range to see more.",
  "No activity this period. If you expected transactions, try adjusting the filter.",
  "Clean slate — no debit or credit entries found for this period.",
];

// ─── Closed Invoices — Empty ───
export const CLOSED_INV_TITLES = [
  "No closed invoices yet",
  "Your payment history lives here",
  "Nothing settled yet",
  "Paid invoices will land here",
];

export const CLOSED_INV_DESCRIPTIONS = [
  "Paid invoices land here with a full breakdown. Send one out to get started!",
  "Your payment history will live here. Create your first invoice to fill it up!",
  "Once an invoice is paid, it shows up here with insights and a full summary.",
  "Nothing settled yet — closed invoices appear here automatically once paid.",
];

// ─── Tickets — Empty ───
export const TICKETS_EMPTY_DESCRIPTIONS = [
  "All clear! If something ever feels off, we're one tap away.",
  "No tickets raised — hopefully everything's running perfectly!",
  "You're issue-free! If something comes up, we've got your back.",
  "No support tickets yet. If you ever need help, the button's right below.",
];

export const TICKETS_FILTER_DESCRIPTIONS = [
  "Nothing matched. Try a different keyword or clear your filters to see all tickets.",
  "We searched everywhere but came up empty. Try broadening your search.",
  "No tickets match your current filters. Try adjusting or clearing them.",
  "Couldn't find that one. Try a different keyword or remove filters.",
];

// ─── Track Ticket — No Results (with query) ───
export const TRACK_NORESULT_TITLES = [
  "No ticket found for that",
  "We couldn't find that one",
  "Nothing came up",
  "That ticket doesn't seem to exist",
];

export const TRACK_NORESULT_DESCRIPTIONS = [
  "Try a different search term — ticket IDs or keywords work best.",
  "No match found. Double-check the ticket number or try a keyword.",
  "We searched everywhere but came up empty. Try another term.",
  "Couldn't locate that ticket. Search by ID, subject, or status.",
];

// ─── Track Ticket — No Query ───
export const TRACK_NOQUERY_TITLES = [
  "Search for a ticket above",
  "Enter a ticket ID to start",
  "What are you looking for?",
  "Find your ticket here",
];

export const TRACK_NOQUERY_DESCRIPTIONS = [
  "Type a ticket ID or keyword above to track your request.",
  "Search by ticket ID, subject, or status to find any of your tickets.",
  "Haven't raised a ticket yet? Tap below and we'll help you out.",
  "Enter a search term above — we'll find it in seconds.",
];

// ─── Maintenance ───
export const MAINTENANCE_TITLES = [
  "We're upgrading this for you",
  "Tuning things up — back shortly",
  "Quick pit stop in progress",
  "Building something better here",
  "This feature is getting a glow-up",
];

export const MAINTENANCE_DESCRIPTIONS = [
  "We're upgrading this for you — back very shortly!",
  "Tuning things up here. This feature will be even better when it's back.",
  "Quick pit stop! We're making improvements. Check back in a bit.",
  "We're building something better here. Won't take long!",
  "This section is getting a glow-up. Back shortly — promise!",
];

// ─── Cancel Ticket Modal ───
export const CANCEL_TITLES = [
  "Close this ticket for good?",
  "Cancel #{ticketNo}?",
  "Sure you want to close this?",
  "This will permanently close #{ticketNo}",
];

export const CANCEL_DESCRIPTIONS = [
  "Once closed, #{ticketNo} can't be reopened and our team won't see it anymore.",
  "This permanently closes #{ticketNo}. If the issue isn't resolved, you'll need to raise a new one.",
  "Heads up — #{ticketNo} will be gone for good. If the problem's still open, consider keeping it.",
  "Closing #{ticketNo} is permanent — our support team will no longer have visibility into it.",
];

export const CANCEL_DISMISS = [
  "Nope, keep it open",
  "No, go back",
  "Actually, never mind",
  "Keep the ticket",
];

export const CANCEL_CONFIRM = [
  "Yes, cancel it",
  "Close ticket",
  "Yep, close it",
  "Confirm cancellation",
];

// ─── Clear Ticket Draft Modal ───
export const CLEAR_DRAFT_TITLES = [
  "Clear everything?",
  "Start fresh?",
  "Erase all content?",
  "Discard your draft?",
];

export const CLEAR_DRAFT_DESCRIPTIONS = [
  "This will remove all text, attachments, and selections. You can't undo this.",
  "Everything you've written will be cleared. Sure you want to start over?",
  "All your progress on this ticket will be lost. This can't be undone.",
  "Your draft, attachments, and selections will be permanently removed.",
];

export const CLEAR_DRAFT_DISMISS = ["No, keep it", "Cancel", "Never mind", "Go back"];

export const CLEAR_DRAFT_CONFIRM = [
  "Yes, clear all",
  "Clear everything",
  "Erase it",
  "Confirm clear",
];

// ─── Biometric Delete Modal ───
export const BIOMETRIC_DELETE_TITLES = [
  "Remove biometric login?",
  "Delete fingerprint access?",
  "Turn off biometric?",
  "Remove this login method?",
];

export const BIOMETRIC_DELETE_DESCRIPTIONS = [
  "Once removed, you'll need to use your MPIN every time you log in.",
  "Deleting fingerprint access means you'll rely on MPIN for login.",
  "Turning off biometric removes the saved data. You can set it up again later.",
  "This removes biometric login from your account. You'll still have MPIN access.",
];

export const BIOMETRIC_DELETE_DISMISS = ["No, keep it", "Cancel", "Never mind", "Go back"];

export const BIOMETRIC_DELETE_CONFIRM = [
  "Yes, remove it",
  "Delete biometric",
  "Remove access",
  "Confirm removal",
];

// ─── DDR Detail — Not Found ───
export const DDR_NOT_FOUND = [
  "We couldn't find that DDR — it may have been removed or the link is incorrect.",
  "DDR not found. Double-check the reference or go back and try again.",
  "This DDR doesn't exist or may have been moved. Try searching from the main list.",
  "No DDR found for that reference. Head back and try a different one.",
];

// ─── SOA Detail — Account Not Found ───
export const ACCOUNT_NOT_FOUND = [
  "We couldn't find that account — it may have been removed or the link is outdated.",
  "Account not found. Try going back and selecting it from the list.",
  "This account doesn't exist or may have been moved. Check the main SOA screen.",
  "No account found for that reference. Head back to the accounts list.",
];

// ─── Repayment — insufficient_funds ───
export const INSUF_TITLES = [
  "Your balance fell a little short",
  "Not enough funds for this EMI",
  "Balance too low at time of deduction",
  "EMI couldn't go through — low balance",
];

export const INSUF_DESCRIPTIONS = [
  "Your balance fell short by a little. Add funds and your EMI will go through instantly.",
  "Not enough balance for this EMI. Top up and retry — takes 30 seconds.",
  "Your account balance was a bit short at the time. Add funds to clear this payment.",
  "EMI couldn't be deducted — insufficient funds. Recharge your account and retry.",
];

export const INSUF_TIPS = [
  "Keep a buffer above your EMI amount to avoid this in future.",
  "Set up a low-balance alert so you're never caught short.",
  "Try scheduling a top-up the day before your EMI date.",
];

// ─── Repayment — bank_server_error ───
export const BANK_ERR_TITLES = [
  "Your bank had a momentary glitch",
  "Bank server hiccup — nothing deducted",
  "Temporary issue at your bank",
  "Bank couldn't process this — no charge made",
];

export const BANK_ERR_DESCRIPTIONS = [
  "Your bank had a momentary glitch. Zero rupees were deducted — safe to retry now.",
  "Bank server hiccup — nothing was charged. Please try again in a moment.",
  "Your bank ran into a temporary issue. No money moved — safe to retry.",
  "This was a bank-side error, not yours. No deduction was made. Try again!",
];

// ─── Repayment — expired_mandate ───
export const MANDATE_TITLES = [
  "Your auto-pay mandate lapsed",
  "Mandate expired — needs renewal",
  "Auto-debit mandate is no longer active",
  "Time to re-register your mandate",
];

export const MANDATE_DESCRIPTIONS = [
  "Your auto-pay mandate lapsed. Re-register in 2 minutes to avoid missing future EMIs.",
  "Auto-debit mandate expired. Renew it now so future EMIs go through smoothly.",
  "Your payment mandate has lapsed. A quick re-registration keeps you on auto-pilot.",
  "Mandate's no longer active — set it up again to keep payments automatic.",
];

// ─── Repayment — Fallback (unknown) ───
export const PAY_FAIL_TITLES = [
  "This payment didn't go through",
  "Something stopped this payment",
  "Payment unsuccessful",
  "Couldn't process this payment",
];

export const PAY_FAIL_DESCRIPTIONS = [
  "This payment didn't go through. Try again — if it keeps failing, we're here to help.",
  "Something stopped this payment. Retry, or contact us if it keeps happening.",
  "Payment unsuccessful. Give it one more try — usually resolves itself.",
  "Couldn't process this payment. Retry or reach out and we'll sort it out.",
];

/**
 * Pick a random message from a pool. Optionally interpolate placeholders
 * like {ticketNo} by passing a vars map.
 */
export function pickRandom(pool: string[], vars?: Record<string, string | number>): string {
  const msg = pool[Math.floor(Math.random() * pool.length)];
  if (!vars) return msg;
  return msg.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
