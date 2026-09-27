import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { DemoProvider } from '@/context/DemoContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'ShipSafe AI — Release Safety Engineer',
  description: 'AI-powered release safety analysis and automated software engineering with IBM Bob',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${mono.variable}`}>
      <body className="bg-slate-950 text-slate-100 antialiased font-sans min-h-screen flex selection:bg-blue-600 selection:text-white">
        <DemoProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNav />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </DemoProvider>
      </body>
    </html>
  );
}
