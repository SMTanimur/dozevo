import { Header, HeroSection, SocialProof, Footer } from '@/components/home';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { constructMetadata } from '@/configs';
import { Metadata } from 'next';

export const metadata: Metadata = constructMetadata({
  canonical: '/',
});

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Header />

      {/* Main Content */}
      <main className='flex-grow flex flex-col items-center'>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}
