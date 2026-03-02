import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "../components/providers/ReduxProvider";
import ConditionalLayout from "../components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baksoSapi = localFont({
  src: "../public/fonts/BaksoSapi.otf",
  variable: "--font-bakso-sapi",
});

const montserrat = localFont({
  src: [
    {
      path: "../public/fonts/static/Montserrat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/static/Montserrat-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/static/Montserrat-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/static/Montserrat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Wuffoos - Pet Care Services",
  description: "Book your next pet care service in seconds with AI assistance",
  icons: {
    icon: "/Ellipse.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${baksoSapi.variable} ${montserrat.variable} font-montserrat antialiased`}
       suppressHydrationWarning={true} 
       >
        <ReduxProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
