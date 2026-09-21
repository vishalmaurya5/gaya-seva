import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'GayaSeva Administrative Console — Super Admin & Section RBAC',
  description: 'Super Admin, Section-wise Admin, CRUD permissions matrix, and SMTP Email management console.',
  icons: {
    icon: '/icongaya.jpeg',
    shortcut: '/icongaya.jpeg',
    apple: '/icongaya.jpeg',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-slate-50 text-[#4A2E1A] antialiased font-sans">
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}
