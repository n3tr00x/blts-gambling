const STORAGE_KEY = 'pending-otp-session';
const OTP_VALID_DURATION_MS = 60 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

type PendingOtpSession = {
  email: string;
  sentAt: number;
};

export function savePendingOtpSession(email: string, sentAt: number = Date.now()) {
  if (typeof window === 'undefined') return;

  const payload: PendingOtpSession = { email, sentAt };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getPendingOtpSession(): PendingOtpSession | null {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingOtpSession;

    if (Date.now() - parsed.sentAt > OTP_VALID_DURATION_MS) {
      clearPendingOtpSession();
      return null;
    }

    return parsed;
  } catch {
    clearPendingOtpSession();
    return null;
  }
}

export function clearPendingOtpSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getOtpResendCooldownSecondsLeft(sentAt: number): number {
  const remainingMs = sentAt + OTP_RESEND_COOLDOWN_MS - Date.now();
  return Math.max(0, Math.ceil(remainingMs / 1000));
}
