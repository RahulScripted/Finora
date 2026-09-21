type Template = { title: string; body: string };

const POOL: Template[] = [
  { title: "Statement ready", body: "Your account statement just landed. Numbers don't lie — tap to review." },
  { title: "Report downloaded", body: "Your financial snapshot is saved. Every rupee, accounted for." },
  { title: "All yours", body: "Statement saved successfully. Your CFO would be proud." },
  { title: "Filed & ready", body: "Downloaded and waiting. Your books are in order." },
  { title: "Statement secured", body: "Saved to your device. Clean records, clean business." },
  { title: "Done in a flash", body: "Your statement is ready. Finance teams love this kind of speed." },
  { title: "Report in hand", body: "Downloaded. Now you have the full picture of your cash flow." },
  { title: "Saved securely", body: "Your statement is on the device. Share it, file it, own it." },
];

export function getDownloadNotification(): Template {
  return POOL[Math.floor(Math.random() * POOL.length)];
}
