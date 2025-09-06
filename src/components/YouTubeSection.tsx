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
    <section className="py-24 bg-muted/5">
      <div className="container px-4">
        <div className="text-center mb-16">
          <div className="mb-1 text-xs uppercase tracking-widest text-primary font-sans font-light animate-on-scroll">Our Video Content</div>
          <h2 className="text-3xl md:text-4xl font-normal font-display mb-6 animate-on-scroll">
            {title}
          </h2>
          <div className="w-16 h-px bg-primary/30 mx-auto mb-6 animate-on-scroll"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light animate-on-scroll mb-8">
            Watch our latest videos and subscribe to our channel for more content.
          </p>
          <a 
            href="https://www.youtube.com/" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm uppercase tracking-widest font-light text-primary hover:text-primary-foreground transition-colors duration-300 inline-flex items-center border border-primary/30 px-6 py-2 hover:bg-primary/10 animate-on-scroll"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current mr-2">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe to Our Channel
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}