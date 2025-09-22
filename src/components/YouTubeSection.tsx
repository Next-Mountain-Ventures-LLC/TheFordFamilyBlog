import React from 'react';
import { buttonVariants } from './ui/button';

interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
  creator: string;
}

interface YouTubeSectionProps {
  title: string;
  videos: Video[];
}

export default function YouTubeSection({ title, videos }: YouTubeSectionProps) {
  return (
    <section className="py-24 bg-muted/5 border-t border-b border-border/20">
      <div className="container px-4">
        <div className="text-center mb-16">
          <div className="mb-1 text-xs uppercase tracking-widest text-primary font-sans font-light animate-on-scroll">Recommended Viewing</div>
          <h2 className="text-3xl md:text-4xl font-normal font-display mb-6 animate-on-scroll">
            {title}
          </h2>
          <div className="w-16 h-px bg-primary/30 mx-auto mb-6 animate-on-scroll"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light mb-8 animate-on-scroll">
            Videos we're enjoying from The Diary Of A CEO YouTube channel
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {videos.map((video, index) => (
            <div 
              key={index} 
              className="scrapbook-paper group transition-all duration-300 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="relative mb-6 overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded-sm transition duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm">
                  <a 
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/95 rounded-full p-3 transform transition-transform duration-300 hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-primary">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="text-xs uppercase tracking-widest text-primary font-light mb-2">{video.creator}</div>
              <h3 className="text-lg font-display font-normal mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">{video.title}</h3>
              <div className="w-10 h-px bg-primary/20 mb-3"></div>
              <a 
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm uppercase tracking-wide font-light text-primary group-hover:text-primary-foreground transition-colors duration-300 inline-flex items-center"
              >
                Watch Video
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="w-16 h-px bg-primary/20 mx-auto mb-8"></div>
          <a 
            href="https://www.youtube.com/@TheDiaryOfACEO" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm uppercase tracking-widest font-light text-primary hover:text-primary-foreground transition-colors duration-300 inline-flex items-center border border-primary/30 px-8 py-3 hover:bg-primary/10"
          >
            Visit The Diary Of A CEO Channel
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}