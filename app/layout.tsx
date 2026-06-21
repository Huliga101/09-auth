import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "NoteHub is a simple application for managing personal notes.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "NoteHub",
    description: "NoteHub is a simple application for managing personal notes.",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "NoteHub application preview",
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.className}`}>
        <TanStackProvider>
         <AuthProvider>
           <Header />
           {children}
           {modal}
           <Footer />
         </AuthProvider>
       </TanStackProvider>
      </body>
    </html>
  );
}