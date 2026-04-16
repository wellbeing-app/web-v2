import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { getDictionary } from "@/lib/dictionary";
import { Navbar } from "@/components/navbar";
import { DictionaryProvider } from "@/components/providers/dictionary-provider";

export async function generateMetadata({ params } : { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang as 'en' | 'cs');
  const baseUrl = 'https://wellbeing.zezulka.me';

  //TODO: add real contact info and social media links
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wellbeing App",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://www.linkedin.com/company/wellbeing-app",
      "https://twitter.com/wellbeingapp",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+420-123-456-789",
      contactType: "customer service",
      areaServed: "CZ",
      availableLanguage: ["English", "Czech"],
    },
  };

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    other: {
      'script': [JSON.stringify(organizationJsonLd)],
    },
  };
}

const fontVariables = `${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`;

export default async function RootLayout({ 
  children,
  params
}: React.PropsWithChildren<{ params: Promise<{ lang: string }> }>) {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as 'en' | 'cs');

  return (
    <html lang={resolvedParams.lang} suppressHydrationWarning>
      <body className={`${fontVariables} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <DictionaryProvider dictionary={dictionary}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar lang={resolvedParams.lang} />
            {children}
          </ThemeProvider>
        </DictionaryProvider>
      </body>
    </html>
  );
}
