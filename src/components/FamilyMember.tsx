import React from 'react';
import { buttonVariants } from './ui/button';

interface FamilyMemberProps {
  name: string;
  role: string;
  description: string;
  interests: string[];
  imageUrl?: string;
  rotate?: string;
  link: string;
  direction?: 'left' | 'right';
}

export default function FamilyMember({ 
  name, 
  role, 
  description, 
  interests, 
  imageUrl, 
  rotate = '0deg',
  link,
  direction = 'left'
}: FamilyMemberProps) {
  return (
    <div className={`flex flex-col md:flex-row gap-12 items-center animate-on-scroll animate-${direction}`}>
      {imageUrl && (
        <div className="scrapbook-photo" style={{ '--rotate': rotate } as React.CSSProperties}>
          <div className="scrapbook-tape" style={{ '--rotate': `-${parseInt(rotate) * 0.5}deg` } as React.CSSProperties}></div>
          <img 
            src={imageUrl} 
            alt={`${name} - family member`} 
            className="w-full md:w-80 h-auto rounded-sm object-cover"
          />
        </div>
      )}
      
      <div className="scrapbook-paper flex-1 relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-display font-normal mb-2 text-foreground">
            <span className="text-primary">{name.split(' ')[0]}</span> {name.split(' ').slice(1).join(' ')}
          </h2>
          <p className="text-base uppercase tracking-wide font-light text-muted-foreground mb-6">{role}</p>
          
          <div className="w-16 h-px bg-primary/20 mb-6"></div>
          
          <p className="mb-6 font-light leading-relaxed">{description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {interests.map((interest, index) => (
              <span 
                key={index}
                className="px-4 py-1.5 text-xs font-light tracking-wide uppercase border border-border/50 text-muted-foreground"
              >
                {interest}
              </span>
            ))}
          </div>
          
          <a href={link} className={buttonVariants({ variant: 'default', size: 'sm' })}>
            See Blog
          </a>
        </div>
      </div>
    </div>
  );
}