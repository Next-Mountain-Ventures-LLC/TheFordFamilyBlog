import React, { useState, useEffect } from 'react';
import { buttonVariants } from './ui/button';

interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
  publishedAt: string;
}

export default function YouTubeChannelSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const channelId = 'UCzM_f1BtFXwPbwhZJ3Pvd5w'; // YouTube channel ID for @TheFordFamilyLife
  const channelUrl = 'https://www.youtube.com/@TheFordFamilyLife';
  
  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        setLoading(true);
        
        // Fetch data from YouTube API
        // This is a simulated response since we don't have direct access to the YouTube API
        // In a real implementation, you would make an API call to YouTube Data API v3
        
        // Simulated YouTube data for demo purposes
        const simulatedVideos: Video[] = [
          {
            title: "Our Family's Journey Through Homeschooling",
            videoId: "dQw4w9WgXcQ", // Placeholder
            thumbnail: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&q=80",
            publishedAt: "2025-05-15"
          },
          {
            title: "Building an Electric Bike from Scratch - Complete Guide",
            videoId: "dQw4w9WgXcQ", // Placeholder
            thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&auto=format&q=80",
            publishedAt: "2025-05-01"
          },
          {
            title: "3D Printing Projects for Beginners with Jackson",
            videoId: "dQw4w9WgXcQ", // Placeholder
            thumbnail: "https://images.unsplash.com/photo-1581092160607-57e25d2edf91?w=600&auto=format&q=80",
            publishedAt: "2025-04-20"
          },
          {
            title: "Get Ready With Me - School Morning Routine",
            videoId: "dQw4w9WgXcQ", // Placeholder
            thumbnail: "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=600&auto=format&q=80",
            publishedAt: "2025-04-10"
          },
          {
            title: "Faith Through Difficult Times - Our Family Story",
            videoId: "dQw4w9WgXcQ", // Placeholder
            thumbnail: "https://images.unsplash.com/photo-1520642413789-218e1ef29ca0?w=600&auto=format&q=80",
            publishedAt: "2025-03-28"
          },
          {
            title: "Day in the Life of a Homeschooling Family",
            videoId: "dQw4w9WgXcQ", // Placeholder
            thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&q=80",
            publishedAt: "2025-03-15"
          }
        ];
        
        setVideos(simulatedVideos);
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
  
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-primary-foreground animate-on-scroll">
            Our YouTube Channel
          </h2>
          <a 
            href={channelUrl}
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
        
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading videos...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <a 
              href={channelUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: 'default' })}
            >
              Visit Our YouTube Channel
            </a>
          </div>
        )}
        
        {!loading && !error && (
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
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold font-display mb-2 line-clamp-2 text-primary-foreground">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(video.publishedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-12">
          <a 
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: 'lg' })}
          >
            View More Videos
          </a>
        </div>
      </div>
    </section>
  );
}