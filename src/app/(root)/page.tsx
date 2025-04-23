// import Image from 'next/image'; // Removed unused import
import {
  Header,
  HeroSection,
  SocialProof,
  Footer
} from '@/components/home'; // Updated import path
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: "TaskZen",
  description: "TaskZen helps you manage your tasks and projects efficiently.",
};
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <HeroSection />
        <SocialProof />
      </main>

      <Footer />
    </div>
  );
}
