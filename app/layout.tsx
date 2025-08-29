import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Bitter, Raleway } from 'next/font/google';

import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

const bitter = Bitter({
  variable: '--font-bitter',
  subsets: ['latin'],
});

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BLTS Gambling',
  description:
    'Aplikacja do śledzenia statystyk z przedsięwzięcia z branży bukmacherskiej',
};

type RootLayoutProps = { children: ReactNode; auth: ReactNode };

export default function RootLayout({ auth, children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bitter.variable} ${raleway.variable} sm:grid sm:h-screen sm:grid-cols-[256px_1fr]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main>{children}</main>
          {auth}
        </ThemeProvider>
      </body>
    </html>
  );
}
