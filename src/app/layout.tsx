// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { ThemeProviderCustom } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Depilzone Admin",
  description:
    "Dashboard administrativo para gestión de recursos e interfaces.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body>
        <ThemeProviderCustom>
          <UserProvider>
            <NotificationProvider>
              <ClientLayout>{children}</ClientLayout>
            </NotificationProvider>
          </UserProvider>
        </ThemeProviderCustom>
      </body>
    </html>
  );
}
