import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LangProvider, type CmsOverrides } from "@/lib/i18n/LangContext";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Webdigio — Agência Digital Premium | Design & Desenvolvimento",
  description: "Webdigio — Agência digital premium. Design, desenvolvimento e performance para negócios que querem crescer online.",
  keywords: "agência digital, web design Portugal, desenvolvimento web, UX/UI design, performance web, Webdigio",
  robots: "index, follow",
  alternates: { canonical: "https://webdigio.pt" },
  openGraph: {
    title: "Webdigio — Agência Digital Premium",
    description: "Criamos produtos digitais que transformam negócios.",
    type: "website",
    url: "https://webdigio.pt",
    locale: "pt_PT",
    siteName: "Webdigio",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const overrides: CmsOverrides = {};
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("site_content")
      .select("section, key, value_pt, value_en");
    if (data) {
      data.forEach(r => {
        const fullKey = `${r.section}.${r.key}`;
        overrides[fullKey] = { PT: r.value_pt, EN: r.value_en };
      });
    }
  } catch {
    // Gracefully fall back to static translations if Supabase is unavailable
  }

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem("webdigio-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);})();` }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <LangProvider overrides={overrides}>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
