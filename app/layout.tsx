import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TawkTo from '../components/TawkTo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'UniiSwap',
  description: 'Precision Uniswap replica',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-[#FFFFFF] text-[#222222] antialiased tracking-[-0.02em]`}>
        <TawkTo />
        {children}
      </body>
    </html>
  );
}
