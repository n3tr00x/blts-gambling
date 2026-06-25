import { useActionState, useEffect, useState } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { OtpResendFeedback } from '@/components/auth/otp-resend-feedback';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useSendOtp } from '@/hooks/use-send-otp';
import { verifyOtpAction } from '@/lib/auth';
import { getOtpResendCooldownSecondsLeft } from '@/lib/auth/otp-session';

type OTPFormProps = {
  email: string;
  onSuccess: () => void;
  onChangeEmail: () => void;
  onResendOtp: (newSentAt: number) => void;
  sentAt: number;
};

const INITIAL_CREDENTIALS = { message: '', success: false };

export function OTPForm({
  email,
  onSuccess,
  onChangeEmail,
  onResendOtp,
  sentAt,
}: OTPFormProps) {
  const OTP_LENGTH = 6;

  const [state, formAction, pending] = useActionState(
    verifyOtpAction,
    INITIAL_CREDENTIALS,
  );
  const [resendState, resendAction, resending] = useSendOtp(() => {
    const now = Date.now();
    onResendOtp(now);
  });
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getOtpResendCooldownSecondsLeft(sentAt),
  );

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  useEffect(() => {
    setSecondsLeft(getOtpResendCooldownSecondsLeft(sentAt));

    const interval = setInterval(() => {
      setSecondsLeft(getOtpResendCooldownSecondsLeft(sentAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [sentAt]);

  const resendDisabled = resending || secondsLeft > 0;

  return (
    <DialogContent>
      <DialogHeader className="font-secondary">
        <DialogTitle className="text-2xl">Wprowadź 6-cyfrowy kod</DialogTitle>
        {state.message && !state.success && (
          <p className="py-1 text-red-300">{state.message}</p>
        )}
      </DialogHeader>
      <form action={formAction} id="verify-otp-form">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <input type="hidden" name="email" value={email} />
              <Input type="email" id="email-display" value={email} disabled />
            </Field>
            <Field>
              <FieldLabel>Kod weryfikacyjny</FieldLabel>
              <InputOTP
                id="otp"
                name="otp"
                maxLength={OTP_LENGTH}
                pattern={REGEXP_ONLY_DIGITS}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  {[...Array(OTP_LENGTH)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="my-7">
          {resendState && resendState.message !== '' && (
            <OtpResendFeedback
              success={resendState.success}
              message={resendState.message}
            />
          )}
        </div>
      </form>
      <DialogFooter className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="link"
          onClick={onChangeEmail}
          className="col-start-2 col-end-3"
        >
          Zmień email
        </Button>
        <Button
          type="submit"
          form="verify-otp-form"
          disabled={pending}
          className="col-start-3 col-end-4"
        >
          {pending ? 'Przetwarzanie...' : 'Zaloguj się'}
        </Button>
        <div className="col-span-3 text-center text-sm">
          {secondsLeft > 0 ? (
            <span className="text-muted-foreground">
              Wyślij kod ponownie za {secondsLeft}s
            </span>
          ) : (
            <Button
              type="submit"
              variant="link"
              form="verify-otp-form"
              formAction={resendAction}
              disabled={resendDisabled}
            >
              {resending ? 'Wysyłanie...' : 'Wyślij kod ponownie'}
            </Button>
          )}
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
