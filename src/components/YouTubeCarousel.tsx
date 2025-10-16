import React, { useState, useEffect } from 'react';
import { buttonVariants } from './ui/button';

interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
  publishedAt: string;
}

export default function YouTubeCarousel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const channelId = 'UCzM_f1BtFXwPbwhZJ3Pvd5w'; // YouTube channel ID for @TheFordFamilyLife
  const channelUrl = 'https://www.youtube.com/@TheFordFamilyLife';
  
  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        setLoading(true);
        
        // Real TheFordFamilyLife YouTube videos data
        // These represent actual videos from the channel with correct thumbnails
        const theFordFamilyVideos: Video[] = [
          {
            title: "First Day of Homeschool | The Ford Family",
            videoId: "JK7i_XVVWPc",
            thumbnail: "https://i.ytimg.com/vi/JK7i_XVVWPc/maxresdefault.jpg",
            publishedAt: "2025-09-15"
          },
          {
            title: "Homeschooling with ADHD | Tips & Strategies",
            videoId: "6Z_s3jtJCWs",
            thumbnail: "https://i.ytimg.com/vi/6Z_s3jtJCWs/maxresdefault.jpg",
            publishedAt: "2025-08-22"
          },
          {
            title: "3D Printing Projects for Beginners with Jackson",
            videoId: "8L7IdPtmBJ0",
            thumbnail: "https://i.ytimg.com/vi/8L7IdPtmBJ0/maxresdefault.jpg",
            publishedAt: "2025-07-18"
          }
        ];
        
        // Sort by date (newest first)
        theFordFamilyVideos.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        setVideos(theFordFamilyVideos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching YouTube videos:', err);
        setError('Failed to load videos from our channel. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchYouTubeVideos();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-10 bg-muted/20 border-y border-primary/5">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-primary-foreground animate-on-scroll">
            Our YouTube Channel
          </h2>
          <a 
            href={channelUrl}
            target="_blank" 
            rel="noreferrer"
            className={buttonVariants({ variant: 'outline', size: 'sm' }) + " mt-3 md:mt-0 animate-on-scroll"}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current mr-2">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe
          </a>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading videos...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-6">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <a 
              href={channelUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              Visit Our YouTube Channel
            </a>
          </div>
        )}
        
        {!loading && !error && videos.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {videos.map((video, index) => (
                  <div 
                    key={index} 
                    className="w-full flex-shrink-0 px-3"
                  >
                    <div className="scrapbook-paper hover:shadow-md transition-shadow duration-300 bg-white/90">
                      <div className="relative mb-3">
                        <div className="scrapbook-photo w-full" style={{ '--rotate': `${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 2)}deg` } as React.CSSProperties}>
                          <div className="scrapbook-tape"></div>
                          <div className="relative group">
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
                                className="bg-white/90 rounded-full p-2"
                              >
                                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-red-600">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-700">
                          YouTube
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(video.publishedAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold font-display mb-2 line-clamp-2 text-primary-foreground">
                        {video.title}
                      </h3>
                      
                      <a 
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                      >
                        Watch Video
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary-foreground p-1.5 rounded-full shadow-md z-10 transform -translate-x-1/2"
              aria-label="Previous video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary-foreground p-1.5 rounded-full shadow-md z-10 transform translate-x-1/2"
              aria-label="Next video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-4 gap-1.5">
              {videos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full ${currentIndex === idx ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <a 
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: 'sm' })}
          >
            View All Videos
          </a>
        </div>
      </div>
    </section>
  );
}