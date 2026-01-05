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
    <div className={`flex flex-col md:flex-row gap-8 items-center animate-on-scroll animate-${direction}`}>
      {imageUrl && (
        <div className="scrapbook-photo" style={{ '--rotate': rotate } as React.CSSProperties}>
          <div className="scrapbook-tape" style={{ '--rotate': `-${parseInt(rotate) * 0.5}deg` } as React.CSSProperties}></div>
          <img
            src={imageUrl}
            alt={`${name} - family member`}
            className="w-full md:w-80 h-auto rounded-sm object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      
      <div className="scrapbook-paper flex-1">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 text-primary-foreground">{name}</h2>
        <p className="text-lg italic text-secondary-foreground mb-4">{role}</p>
        <p className="mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {interests.map((interest, index) => (
            <span 
              key={index}
              className="px-3 py-1 text-xs rounded-full bg-accent/20 text-accent-foreground"
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
  );
}
