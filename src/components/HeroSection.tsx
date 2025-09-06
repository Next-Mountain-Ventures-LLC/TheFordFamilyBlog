import React from 'react';
import { buttonVariants } from './ui/button';

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
      imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&q=80", 
      rotate: "-2deg"
    },
    {
      name: "Salicia Ford",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&q=80", 
      rotate: "1deg"
    },
    {
      name: "Jackson Ford",
      imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&auto=format&q=80", 
      rotate: "-1deg"
    },
    {
      name: "Finley Ford",
      imageUrl: "https://images.unsplash.com/photo-1517677129300-07b130802f46?w=400&auto=format&q=80", 
      rotate: "2deg"
    }
  ];

  return (
    <section className="py-28 pb-36 relative overflow-hidden hero-section">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full -z-10"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-1 h-20 bg-primary/20 -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-1 h-20 bg-secondary/20 -z-10"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 -z-10" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <div className="mb-1 text-xs uppercase tracking-widest text-primary font-sans font-light animate-on-scroll">Welcome to</div>
          <h1 className="text-5xl md:text-7xl font-light font-display mb-8 animate-on-scroll">
            <span className="text-foreground">The Ford <span className="text-primary font-normal">Family</span></span>
            <span className="text-accent font-light text-4xl md:text-5xl">.life</span>
          </h1>
          
          <div className="w-24 h-px bg-primary/30 mx-auto mb-8 animate-on-scroll"></div>
          
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-on-scroll text-muted-foreground">
            Our journey through faith, health challenges, homeschooling, entrepreneurship, and creativity.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 animate-on-scroll">
            <a href="#family" className={buttonVariants({ size: 'lg', variant: 'default' })}>
              Meet Our Family
            </a>
            <a 
              href="https://www.youtube.com/" 
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current mr-2">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Our YouTube
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {familyMembers.map((member, index) => {
            // Determine which animation class to use based on index
            const animationClass = `hero-photo-${index + 1}`;
            
            return (
              <div key={index} className="flex flex-col items-center">
                {member.imageUrl && (
                  <div 
                    className={`scrapbook-photo mb-6 ${animationClass}`} 
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
                <h3 className="text-base font-normal tracking-wide font-display text-foreground">{member.name}</h3>
                <div className="w-12 h-px bg-primary/30 mt-2"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}