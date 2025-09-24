import React from 'react';
import { buttonVariants } from './ui/button';
import joshuaImage from '../assets/joshua-ford-family-profile_nw_79fe0e22.jpg';
import saliciaImage from '../assets/salicias-profile_nw_7fb06e56.jpg';
import jacksonImage from '../assets/jackson_ford_nw_10531fa1.jpg';
import finleyImage from '../assets/finley-profile-image_nw_40f934be.jpg';

interface FamilyMemberThumbnail {
  name: string;
  imageUrl?: string;
  rotate?: string;
}

export default function HeroSection() {
  // Placeholder data for family members
  const familyMembers: FamilyMemberThumbnail[] = [
    {
      name: "Joshua Ford",
      imageUrl: joshuaImage.src,
      rotate: "-3deg"
    },
    {
      name: "Salicia Ford",
      imageUrl: saliciaImage.src, 
      rotate: "2deg"
    },
    {
      name: "Jackson Ford",
      imageUrl: jacksonImage.src, 
      rotate: "-2deg"
    },
    {
      name: "Finley Ford",
      imageUrl: finleyImage.src, 
      rotate: "3deg"
    }
  ];

  return (
    <section className="py-12 relative overflow-hidden hero-section">
      {/* Background image and overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/80 -z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 -z-20"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1756982477661-107a1c72c8fd?w=1200&h=300&auto=format&fit=crop&q=80')",
          backgroundPosition: "center 30%"
        }}
      ></div>

      {/* Decorative elements for scrapbook feel */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-secondary/10 rounded-full -z-10"></div>

      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 animate-on-scroll drop-shadow-md">
            <span className="text-primary-foreground">The Ford Family</span>
            <span className="text-accent-foreground text-3xl md:text-5xl">.life</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6 animate-on-scroll text-foreground/90 drop-shadow-sm">
            Our journey through faith, health challenges, homeschooling, entrepreneurship, and creativity.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-on-scroll">
            <a href="#family" className={buttonVariants({ size: "md" })}>
              Meet Our Family
            </a>
            <a 
              href="https://www.youtube.com/@TheFordFamilyLife" 
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: 'outline', size: "md" })}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current mr-2">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Our YouTube
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {familyMembers.map((member, index) => {
            // Determine which animation class to use based on index
            const animationClass = `hero-photo-${index + 1}`;
            
            return (
              <div key={index} className="flex flex-col items-center">
                {member.imageUrl && (
                  <div 
                    className={`scrapbook-photo mb-4 ${animationClass}`} 
                    style={{ '--rotate': member.rotate } as React.CSSProperties}
                  >
                    <div 
                      className="scrapbook-tape"
                      style={{ '--rotate': `-${parseInt(member.rotate || '0deg') * 0.5}deg` } as React.CSSProperties}
                    ></div>
                    <img 
                      src={member.imageUrl} 
                      alt={`${member.name} - family member`} 
                      className="w-full h-auto aspect-square object-cover rounded-sm"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold font-display text-primary-foreground">{member.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}