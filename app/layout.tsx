import './globals.css';
import type { Metadata } from 'next';
import  Navbar  from '@/components/HeroComponents/Navbar';
// import Sidebar from '@/components/Sidebar';
import { FooterWrapper } from '@/components/HeroComponents/FooterWrapper';

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
      <body className=" bg-slate-200 text-gray-900">
      <Navbar/>
        {children}
      {/* <Footer/> */}
      <FooterWrapper/>
      </body>
    </html>
  );
}