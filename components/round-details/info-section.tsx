import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type InfoSectionProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
  className: string;
};

export function InfoSection({ icon, title, children, className }: InfoSectionProps) {
  return (
    <div className={cn('bg-muted/50 flex gap-4 rounded-md p-4 shadow', className)}>
      <div className="bg-muted self-start rounded-md border p-2">{icon}</div>
      <div className="flex w-full flex-col gap-2">
        {title && <p className="text-lg font-semibold tracking-tight">{title}</p>}
        {children}
      </div>
    </div>
  );
}
