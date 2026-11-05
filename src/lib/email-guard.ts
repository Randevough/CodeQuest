export const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  'tempmail.com',
  'mailinator.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'temp-mail.org',
  'dispostable.com',
  'fakeinbox.com',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOLDOWN_MS = 60 * 1000;
const emailCooldownMap = new Map<string, number>();

export interface EmailValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateRegistrationEmail(email: string): EmailValidationResult {
  const normalized = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalized)) {
    return { valid: false, reason: 'Invalid email format' };
  }

  const domain = normalized.split('@')[1];

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: 'Temporary and disposable email addresses are not allowed.',
    };
  }

  const rawAllowedDomains = process.env.ALLOWED_EMAIL_DOMAINS;
  if (rawAllowedDomains && rawAllowedDomains.trim().length > 0) {
    const allowed = rawAllowedDomains
      .split(',')
      .map((d) => d.trim().toLowerCase())
      .filter((d) => d.length > 0);

    if (allowed.length > 0 && !allowed.includes(domain)) {
      return {
        valid: false,
        reason: 'Registration is restricted to authorized domains.',
      };
    }
  }

  return { valid: true };
}

// ponytail: in-memory Map rate-limits email sending per instance; upgrade to Redis sliding window if scaled across multi-region serverless.
export function canSendVerificationEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const now = Date.now();
  const lastSent = emailCooldownMap.get(normalized);

  if (lastSent && now - lastSent < COOLDOWN_MS) {
    return false;
  }

  emailCooldownMap.set(normalized, now);
  return true;
}

export function resetEmailCooldownStore(): void {
  emailCooldownMap.clear();
}
