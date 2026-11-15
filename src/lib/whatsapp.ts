export const DUMMY_WHATSAPP_NUMBER = "6281234567890";
export const WHATSAPP_PLACEHOLDER_TEXT = "[ISI: nomor WhatsApp]";

const WHATSAPP_DIGITS_REGEX = /^\d{9,15}$/;

export function isValidWhatsAppNumber(
  value: string | null | undefined
): value is string {
  if (typeof value !== "string") return false;
  return WHATSAPP_DIGITS_REGEX.test(value.trim());
}

export function getWhatsAppHref(
  value: string | null | undefined
): string | null {
  if (!isValidWhatsAppNumber(value)) return null;
  return `https://wa.me/${value.trim()}`;
}

export function isDummyWhatsAppNumber(
  value: string | null | undefined
): boolean {
  return typeof value === "string" && value.trim() === DUMMY_WHATSAPP_NUMBER;
}
