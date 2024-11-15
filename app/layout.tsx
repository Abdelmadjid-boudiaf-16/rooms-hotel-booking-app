import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import AuthProvider from "./provieders/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import LayoutProvider from "./provieders/layout-provider";
const roboto = Roboto({ subsets: ['latin'], weight: ['100', '300', '400', '700']})


export const metadata: Metadata = {
  title: "Hotel Rooms Booking",
  description: "build a full stack hotel rooms booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <AuthProvider>
            <Toaster />
            <LayoutProvider>{children}</LayoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
