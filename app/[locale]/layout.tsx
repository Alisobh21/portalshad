import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProvider } from "@/store/AppProvider";
import "../globals.css";
import { ibmPlex, rubik } from "@/config/fonts";
import ConditionalLayout from "./ConditionalLayout";
import { Providers } from "./provider";
import { Toaster } from "@/components/ui/sonner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  modals,
  params,
}: {
  children: React.ReactNode;
  modals: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${rubik.variable} bg-background ${rubik.variable} ${ibmPlex.variable} font-rubik rtl:font-ibmPlex  antialiased ${geistMono.variable}`}
      >
        <ThemeProvider>
          <AppProvider>
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "dark" }}
            >
              <NextIntlClientProvider messages={messages}>
                <ConditionalLayout>
                  {children}
                  {modals}
                </ConditionalLayout>
                <Toaster richColors closeButton expand position="top-center" />
              </NextIntlClientProvider>
            </Providers>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
