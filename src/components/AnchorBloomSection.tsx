import React from 'react';
import { buttonVariants } from './ui/button';

interface AnchorBloomSectionProps {
  title?: string;
}

export default function AnchorBloomSection({ title = "Anchor and Bloom" }: AnchorBloomSectionProps) {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Image and Mission */}
          <div className="lg:col-span-2">
            <div className="scrapbook-paper bg-white/90 p-6 h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="mb-6 scrapbook-photo" style={{ '--rotate': '1deg' } as React.CSSProperties}>
                    <div className="scrapbook-tape"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&auto=format&q=80" 
                      alt="Anchor and Bloom Non-Profit" 
                      className="w-full h-auto rounded-sm"
                    />
                  </div>
                  
                  <h2 className="text-2xl font-bold font-display mb-4 text-primary-foreground">
                    {title}
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="font-bold mb-2 text-secondary-foreground">Our Mission</h3>
                    <p className="text-muted-foreground">
                      Empowering families facing chronic illness and neurodivergence to create 
                      structured, peaceful homes where everyone can thrive despite life's challenges.
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <a 
                    href="#" 
                    className={buttonVariants({ variant: "default", size: "sm", className: "w-full" })}
                  >
                    Support Our Mission
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Programs and Impact */}
          <div className="lg:col-span-3">
            <div className="scrapbook-paper bg-white/90 p-6 h-full">
              <h3 className="text-xl font-bold font-display mb-4 text-primary-foreground">
                How We Help Families
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border-l-4 border-primary/40 pl-4">
                  <h4 className="font-bold mb-2">Homeschooling Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Curriculum guidance, teaching strategies, and resources for families 
                    homeschooling children with special needs or chronic illness.
                  </p>
                </div>
                
                <div className="border-l-4 border-secondary/40 pl-4">
                  <h4 className="font-bold mb-2">Healthcare Advocacy</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Mentorship and guidance for navigating complex healthcare systems, 
                    especially for families dealing with rare or chronic conditions.
                  </p>
                </div>
                
                <div className="border-l-4 border-accent/40 pl-4">
                  <h4 className="font-bold mb-2">Family Organization Systems</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Custom planning tools, routines, and systems to help overwhelmed 
                    families bring structure to chaos.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary/40 pl-4">
                  <h4 className="font-bold mb-2">Parent Support Network</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Community gatherings and small groups where parents can share 
                    experiences, resources, and encouragement.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md">
                <h3 className="font-bold mb-3">Our Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">150+</p>
                    <p className="text-xs text-muted-foreground">Families Supported</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">24</p>
                    <p className="text-xs text-muted-foreground">Educational Workshops</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">35</p>
                    <p className="text-xs text-muted-foreground">Scholarships Awarded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">Community Events</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <a 
                  href="#" 
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Learn More
                </a>
                <a 
                  href="#" 
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  Get Involved
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}