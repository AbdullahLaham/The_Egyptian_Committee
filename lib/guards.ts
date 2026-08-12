export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function safeText(value: unknown, fallback = '') {
  return isNonEmptyString(value) ? value : fallback;
}
