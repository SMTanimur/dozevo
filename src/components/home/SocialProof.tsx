import React from 'react';
import { Marquee } from "@/components/magicui/marquee";

// Placeholder Logo Component - Adjust styling for subtlety
const LogoPlaceholder = ({ name }: { name: string }) => (
  <div className="relative w-28 sm:w-32 h-10 flex justify-center items-center px-2">
    {/* Reduced width, increased opacity/grayscale */}
    <span className="text-gray-300 font-medium text-base sm:text-lg grayscale opacity-40 transition-opacity duration-300 hover:opacity-60">
      {name}
    </span>
  </div>
);

const logos = [
  { name: 'Shipt' },
  { name: 'CN' },
  { name: 'Miami Uni' },
  { name: 'Padres' },
  { name: 'T-Mobile' },
  { name: 'Sephora' },
  { name: 'Logitech' },
  // Duplicate for smoother looping if needed
  { name: 'Shipt' },
  { name: 'CN' },
  { name: 'Miami Uni' },
  { name: 'Padres' },
  { name: 'T-Mobile' },
  { name: 'Sephora' },
  { name: 'Logitech' },
];

const firstRow = logos.slice(0, logos.length / 2);
const secondRow = logos.slice(logos.length / 2);

export const SocialProof = () => {
  return (
    <section className="w-full max-w-5xl mx-auto mt-24 sm:mt-32">
      {/* Adjusted text style */}
      <p className="text-center text-xs text-gray-400 mb-8">
        Trusted by the world&apos;s leading businesses
      </p>
      {/* Marquee container adjusted */}
      <div className="relative flex h-24 w-full flex-col items-center justify-center overflow-hidden rounded-lg py-2">
        <Marquee pauseOnHover className="[--duration:60s]"> {/* Slower duration */} 
          {firstRow.map((logo) => (
            <LogoPlaceholder key={`${logo.name}-1`} name={logo.name} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:60s]"> {/* Slower duration */} 
          {secondRow.map((logo) => (
            <LogoPlaceholder key={`${logo.name}-2`} name={logo.name} />
          ))}
        </Marquee>
        {/* Fades for marquee edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </section>
  );
}; 