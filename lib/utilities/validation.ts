import { emailStepFormSchema, otpStepFormSchema } from '@/schemas';

export function getEmailValidationError(email: string) {
  const validation = emailStepFormSchema.safeParse(email);

  if (!validation.success) {
    const issues = validation.error.issues;
    const tooSmallIssue = issues.find(issue => issue.code === 'too_small');
    const invalidEmailIssue = issues.find(issue => issue.code === 'invalid_format');

    if (tooSmallIssue) {
      return tooSmallIssue.message;
    }

    if (invalidEmailIssue) {
      return invalidEmailIssue.message;
    }
  }
}

export function getOtpValidationError(otp: string) {
  const validation = otpStepFormSchema.safeParse(otp);

  if (!validation.success) {
    const issues = validation.error.issues;
    const tooSmallIssue = issues.find(issue => issue.code === 'too_small');

    if (tooSmallIssue) {
      return tooSmallIssue.message;
    }
  }
}
