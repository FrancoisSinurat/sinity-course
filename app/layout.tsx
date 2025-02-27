import './globals.css';
import type { Metadata } from 'next';
import { Geist} from 'next/font/google';
import { Inter } from 'next/font/google';
import  Navbar  from '@/components/Navbar';
import { FooterWrapper } from '@/components/FooterWrapper';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter',
// });


export const metadata: Metadata = {
  title: 'Sinity Course',
  description: 'Final Project Francois NS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=" bg-[#E2CEB1] mt-4 text-gray-900">
      <Navbar/>
        {children}
      {/* <Footer/> */}
      <FooterWrapper/>
      </body>
    </html>
  );
}