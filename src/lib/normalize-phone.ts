/**
 * Приводит телефон к единому виду: только цифры, первая — 7.
 * "+7 (900) 123-45-67" → "79001234567"
 * "8 900 123 45 67"   → "79001234567"
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8") && digits.length === 11) {
    return "7" + digits.slice(1);
  }
  return digits;
}
