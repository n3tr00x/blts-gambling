'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { EmailForm } from '@/components/auth/email-form';
import { OTPForm } from '@/components/auth/otp-form';
import { Dialog } from '@/components/ui/dialog';
import {
  clearPendingOtpSession,
  getPendingOtpSession,
  savePendingOtpSession,
} from '@/lib/auth/otp-session';

export default function SignInPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [sentAt, setSentAt] = useState(0);

  useEffect(() => {
    if (pathname.includes('sign-in')) {
      const pending = getPendingOtpSession();

      setOpen(true);

      if (pending) {
        setStep('otp');
        setEmail(pending.email);
        setSentAt(pending.sentAt);
      } else {
        setStep('email');
        setEmail('');
      }
    }
  }, [pathname]);

  const openChangeHandler = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      router.back();
    }
  };

  const emailSuccessHandler = (sentEmail: string) => {
    const now = Date.now();

    setEmail(sentEmail);
    setStep('otp');
    setSentAt(now);

    savePendingOtpSession(sentEmail, now);
  };

  const changeEmailHandler = () => {
    setStep('email');
    setEmail('');
    clearPendingOtpSession();
  };

  const resendOtpHandler = (newSentAt: number) => {
    setSentAt(newSentAt);
    savePendingOtpSession(email, newSentAt);
  };

  return (
    <Dialog open={open} onOpenChange={openChangeHandler}>
      {step === 'email' && <EmailForm onSuccess={emailSuccessHandler} />}
      {step === 'otp' && (
        <OTPForm
          email={email}
          sentAt={sentAt}
          onChangeEmail={changeEmailHandler}
          onResendOtp={resendOtpHandler}
          onSuccess={() => {
            setOpen(false);
            setEmail('');
            setStep('email');
            clearPendingOtpSession();
            router.replace('/rounds');
          }}
        />
      )}
    </Dialog>
  );
}
