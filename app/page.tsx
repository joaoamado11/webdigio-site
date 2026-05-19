import type { Metadata } from 'next';
import Loader         from '@/components/ui/Loader';
import CursorAura     from '@/components/ui/CursorAura';
import ScrollProgress from '@/components/ui/ScrollProgress';
import ChatWidget     from '@/components/ui/ChatWidget';
import WhatsAppFloat  from '@/components/ui/WhatsAppFloat';
import Navbar         from '@/components/layout/Navbar';
import HeroPortal     from '@/components/sections/HeroPortal';
import CinematicExpertise from '@/components/sections/CinematicExpertise';
import Services       from '@/components/sections/Services';
import WhyWebdigio    from '@/components/sections/WhyWebdigio';
import Process        from '@/components/sections/Process';
import Industries     from '@/components/sections/Industries';
import Pricing        from '@/components/sections/Pricing';
import FAQ            from '@/components/sections/FAQ';
import TechStack      from '@/components/sections/TechStack';
import CTAFooter      from '@/components/sections/CTAFooter';

export const metadata: Metadata = {
  title: 'Webdigio — Websites Premium para Empresas Portuguesas',
  description:
    'Websites rápidos, modernos e otimizados para Google. Design premium com entrega em 2 a 5 dias. Pagamento único sem mensalidades.',
  keywords: 'website, design, desenvolvimento web, SEO, Portugal, empresa, landing page',
  openGraph: {
    title: 'Webdigio — Websites Premium',
    description: 'Websites rápidos, modernos e otimizados para Google.',
    url: 'https://webdigio.pt',
    siteName: 'Webdigio',
    locale: 'pt_PT',
    type: 'website',
    images: [{ url: '/assets/bigWBlogowhite.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webdigio — Websites Premium',
    description: 'Websites rápidos, modernos e otimizados para Google.',
    images: ['/assets/bigWBlogowhite.png'],
  },
  icons: { icon: '/assets/favicon.svg' },
};

export default function HomePage() {
  return (
    <>
      <Loader />
      <CursorAura />
      <ScrollProgress />
      <div className="dot-grid-bg" aria-hidden="true" />
      <Navbar />
      <main>
        <HeroPortal />
        <CinematicExpertise />
        <Services />
        <WhyWebdigio />
        <Process />
        <Industries />
        <Pricing />
        <FAQ />
        <TechStack />
        <CTAFooter />
      </main>
      <WhatsAppFloat />
      <ChatWidget />
    </>
  );
}
