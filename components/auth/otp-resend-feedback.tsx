import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type OtpResendFeedbackProps = {
  success: boolean;
  message: string;
};

const STATUS_COLORS = {
  success: {
    icon: CheckCircle2Icon,
    iconClass: 'stroke-green-400',
    variant: 'default' as const,
    borderClass: 'border-green-400',
    textClass: 'text-green-400',
    label: 'Sukces',
  },
  error: {
    icon: XCircleIcon,
    iconClass: 'stroke-red-400',
    variant: 'destructive' as const,
    borderClass: 'border-red-400',
    textClass: 'text-red-400',
    label: 'Niepowodzenie',
  },
};
export function OtpResendFeedback({ success, message }: OtpResendFeedbackProps) {
  const status = success ? STATUS_COLORS.success : STATUS_COLORS.error;

  return (
    <Alert variant={status.variant} className={status.borderClass}>
      <status.icon className={status.iconClass} />
      <AlertTitle className={status.textClass}>{status.label}</AlertTitle>
      <AlertDescription className="font-secondary">{message}</AlertDescription>
    </Alert>
  );
}
