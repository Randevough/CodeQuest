import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  validateRegistrationEmail,
  canSendVerificationEmail,
  resetEmailCooldownStore,
  DISPOSABLE_DOMAINS,
} from '@/lib/email-guard';

describe('email-guard', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.ALLOWED_EMAIL_DOMAINS;
    resetEmailCooldownStore();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('validateRegistrationEmail', () => {
    describe('invalid email formats', () => {
      const invalidEmails = [
        '',
        '   ',
        'plainaddress',
        '@missingusername.com',
        'username@.com',
        'username@domain',
        'user@domain.',
        'user space@domain.com',
        'user@domain .com',
      ];

      it.each(invalidEmails)('rejects invalid format: "%s"', (email) => {
        const result = validateRegistrationEmail(email);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Invalid email format');
      });
    });

    describe('disposable email domains', () => {
      const sampleDisposableEmails = [
        'attacker@10minutemail.com',
        'user@tempmail.com',
        'spammer@mailinator.com',
        'bot@guerrillamail.com',
        'test@throwawaymail.com',
        'anon@yopmail.com',
        'junk@trashmail.com',
        'temp@sharklasers.com',
        'temp2@temp-mail.org',
        'fake@dispostable.com',
        'throwaway@fakeinbox.com',
      ];

      it.each(sampleDisposableEmails)('rejects disposable email: %s', (email) => {
        const result = validateRegistrationEmail(email);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe(
          'Temporary and disposable email addresses are not allowed.'
        );
      });

      it('covers all domains in DISPOSABLE_DOMAINS set', () => {
        for (const domain of DISPOSABLE_DOMAINS) {
          const result = validateRegistrationEmail(`user@${domain}`);
          expect(result.valid).toBe(false);
          expect(result.reason).toBe(
            'Temporary and disposable email addresses are not allowed.'
          );
        }
      });
    });

    describe('valid standard domains without restrictions', () => {
      const validEmails = [
        'developer@gmail.com',
        'student@cyber-univ.ac.id',
        'staff@company.org',
        'user@subdomain.example.co.uk',
        '  clean.me@outlook.com  ',
        'UPPERCASE@GMAIL.COM',
      ];

      it.each(validEmails)('accepts valid email: %s', (email) => {
        const result = validateRegistrationEmail(email);
        expect(result.valid).toBe(true);
        expect(result.reason).toBeUndefined();
      });
    });

    describe('ALLOWED_EMAIL_DOMAINS restriction', () => {
      it('allows emails within configured allowed domains', () => {
        process.env.ALLOWED_EMAIL_DOMAINS = 'cyber-univ.ac.id, acme.org';

        const university = validateRegistrationEmail('student@cyber-univ.ac.id');
        expect(university.valid).toBe(true);

        const company = validateRegistrationEmail('worker@acme.org');
        expect(company.valid).toBe(true);
      });

      it('rejects emails outside configured allowed domains', () => {
        process.env.ALLOWED_EMAIL_DOMAINS = 'cyber-univ.ac.id, acme.org';

        const publicMail = validateRegistrationEmail('student@gmail.com');
        expect(publicMail.valid).toBe(false);
        expect(publicMail.reason).toBe(
          'Registration is restricted to authorized domains.'
        );
      });

      it('handles mixed case and whitespace in ALLOWED_EMAIL_DOMAINS', () => {
        process.env.ALLOWED_EMAIL_DOMAINS = '  CYBER-UNIV.AC.ID ,  Acme.Org  ';

        const mixedEmail = validateRegistrationEmail('STUDENT@cyber-univ.ac.id');
        expect(mixedEmail.valid).toBe(true);
      });

      it('allows all valid domains when ALLOWED_EMAIL_DOMAINS is empty string', () => {
        process.env.ALLOWED_EMAIL_DOMAINS = '';

        const result = validateRegistrationEmail('user@gmail.com');
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('canSendVerificationEmail', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('allows initial email send', () => {
      expect(canSendVerificationEmail('user@example.com')).toBe(true);
    });

    it('blocks subsequent email send within 60 second cooldown', () => {
      expect(canSendVerificationEmail('user@example.com')).toBe(true);
      expect(canSendVerificationEmail('user@example.com')).toBe(false);

      vi.advanceTimersByTime(30 * 1000);
      expect(canSendVerificationEmail('user@example.com')).toBe(false);
    });

    it('allows sending again after cooldown expires', () => {
      expect(canSendVerificationEmail('user@example.com')).toBe(true);

      vi.advanceTimersByTime(60 * 1000);
      expect(canSendVerificationEmail('user@example.com')).toBe(true);
    });

    it('isolates cooldown per email address (case-insensitive and trimmed)', () => {
      expect(canSendVerificationEmail('first@example.com')).toBe(true);
      expect(canSendVerificationEmail('second@example.com')).toBe(true);

      expect(canSendVerificationEmail('  FIRST@example.com ')).toBe(false);
    });
  });
});
