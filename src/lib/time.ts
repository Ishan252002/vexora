const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** The coming Sunday at 23:59:59 India Standard Time. Weekly offers end then. */
export function offerEndsAt(now: Date = new Date()): Date {
  // Shift so the UTC getters read as IST wall-clock values.
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  const daysToSunday = (7 - ist.getUTCDay()) % 7;
  const endAsIst = Date.UTC(
    ist.getUTCFullYear(),
    ist.getUTCMonth(),
    ist.getUTCDate() + daysToSunday,
    23,
    59,
    59,
  );
  return new Date(endAsIst - IST_OFFSET_MS);
}

export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** Illustrative delivery window: 3 to 5 days from today. */
export function deliveryWindow(now: Date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const from = new Date(now.getTime() + 3 * 86400000);
  const to = new Date(now.getTime() + 5 * 86400000);
  return `${fmt.format(from)} to ${fmt.format(to)}`;
}
