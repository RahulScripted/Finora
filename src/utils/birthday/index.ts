/**
 * True when the given date-of-birth falls on today's month + day (year is
 * ignored). Returns false for empty / invalid input.
 */
export function isBirthdayToday(dateOfBirth?: string | null): boolean {
  if (!dateOfBirth) return false;

  // Parse month/day directly from the string when it looks like YYYY-MM-DD so
  // we avoid timezone shifts (new Date("1992-09-27") is UTC midnight, which can
  // roll to the previous day in negative-offset timezones).
  const iso = dateOfBirth.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const now = new Date();
  if (iso) {
    const month = Number(iso[2]) - 1;
    const day = Number(iso[3]);
    return month === now.getMonth() && day === now.getDate();
  }

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return false;
  return dob.getMonth() === now.getMonth() && dob.getDate() === now.getDate();
}
