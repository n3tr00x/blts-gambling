'use client';

import { useActionState } from 'react';

import { sendOtpAction } from '@/lib/auth';
import { getEmailValidationError } from '@/lib/utilities';
import { AuthActionResult } from '@/types/actions.types';

const INITIAL_STATE: AuthActionResult = { message: '', success: false };

export function useSendOtp(onSuccess: (email: string) => void) {
  return useActionState(async (_prev: AuthActionResult, formData: FormData) => {
    const email = formData.get('email') as string;
    const emailValidationError = getEmailValidationError(email);

    if (emailValidationError) {
      return {
        success: false,
        message: emailValidationError,
      };
    }

    const result = await sendOtpAction(formData);

    if (result.success) {
      onSuccess(email);
    }

    return result;
  }, INITIAL_STATE);
}
