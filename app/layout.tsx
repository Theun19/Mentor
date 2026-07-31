import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentormap Chauffeurs Nijmegen",
  description:
    "Voortgang, aftekenlijsten, beoordelingen en lijnverkenning voor nieuwe chauffeurs in Nijmegen.",
  applicationName: "Mentormap Chauffeurs Nijmegen",
  manifest: "/mentor/site.webmanifest",
  themeColor: "#4f287b",
  icons: {
    icon: "/mentor/favicon.svg",
    apple: "/mentor/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
