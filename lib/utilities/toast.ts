import { toast } from 'sonner';
import { ActionState } from '@/types';

type ToastPromiseParams<T> = Parameters<typeof toast.promise<T>>[1];

type ToastConfig<T = ActionState> = ToastPromiseParams<T>;

const withToastPromise = <Args extends unknown[], T extends ActionState>(
  fn: (...args: Args) => Promise<T>,
  config: ToastConfig = {},
) => {
  return async (...args: Args) => {
    const promise = fn(...args);

    toast.promise<T>(promise, {
      loading: config.loading || 'Przetwarzanie...',
      ...config,
    });

    return promise;
  };
};

export { withToastPromise };
