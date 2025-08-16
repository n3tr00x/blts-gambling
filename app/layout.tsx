import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Bitter, Raleway } from 'next/font/google';

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

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={`${bitter.variable} ${raleway.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
