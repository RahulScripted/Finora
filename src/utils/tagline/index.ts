// ─── About screen taglines ───
// A pool of punchy, on-brand taglines. One is picked at random per render.
export const TAGLINES = [
  'Client said "Friday." It\'s been three Fridays. Get paid today, not whenever they remember.',
  "Your invoice is 60 days old. Your rent isn't waiting. Get paid now and let your client take their time.",
  '"Payment processed" is not a payment. Neither is "checking with accounts." Get the real money in your bank today.',
  "Send the invoice. Skip the follow-ups. Get paid before your client remembers your name.",
  'Your GST is due. Their payment is "in process." We\'ll cover the gap.',
  'You did the work. They sent "Noted." Your bank sent nothing, so we sent the money.',
  "Stop being your client's free bank. Get paid today and let them pay us in 60 days. Nobody's chasing you.",
  "Net 60 is a lifestyle. Not yours. Get paid now and let your client keep theirs.",
  'Follow-ups are not a business model. Send the invoice, get the money, and skip the "gentle reminder" emails.',
  "Your client is on holiday. Your bills aren't. Get paid today and let them enjoy the beach.",
  "Late payments are their problem. Cash flow is ours. Go back to running your business.",
  "Chase dreams, not clients. Your invoices are already on their way to cash. Your client can take all the time they want.",
];

/** Returns a random tagline from the pool. */
export function randomTagline(): string {
  return TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
}
