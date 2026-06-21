import { useActionState } from 'react';

import { verifyOtpAction } from '@/lib/auth';
import { AuthActionResult } from '@/types/actions.types';

const INITIAL_STATE: AuthActionResult = { message: '', success: false };

export function useVerifyOtp() {
  return useActionState(verifyOtpAction, INITIAL_STATE);
}
