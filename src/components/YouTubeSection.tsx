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
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-primary-foreground animate-on-scroll">
            {title}
          </h2>
          <a 
            href="https://www.youtube.com/@TheFordFamilyLife" 
            target="_blank" 
            rel="noreferrer"
            className={buttonVariants({ variant: 'outline' }) + " mt-4 md:mt-0 animate-on-scroll"}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current mr-2">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe to Our Channel
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div 
              key={index} 
              className="scrapbook-paper hover:shadow-lg transition-shadow duration-300 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="relative mb-3 group">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm">
                  <a 
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/90 rounded-full p-3"
                  >
                    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-red-600">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold font-display mb-2 line-clamp-2 text-primary-foreground">{video.title}</h3>
              <p className="text-sm text-muted-foreground">{video.creator}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}