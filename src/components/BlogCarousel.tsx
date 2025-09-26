import React, { useState, useRef, useEffect } from 'react';
import { buttonVariants } from './ui/button';

interface BlogPost {
  id?: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  slug: string;
  author?: string;
  content?: string;
}

interface BlogCarouselProps {
  title: string;
  description?: string;
  posts: BlogPost[];
}

export default function BlogCarousel({ title, description, posts }: BlogCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [visiblePosts, setVisiblePosts] = useState(3);

  useEffect(() => {
    // Initial value for server-side rendering
    if (typeof window === 'undefined') {
      setVisiblePosts(3);
      setMaxIndex(Math.max(0, posts.length - 3));
      return;
    }
    
    const handleResize = () => {
      let visible = 1;
      if (window.innerWidth >= 1024) {
        visible = 3;
      } else if (window.innerWidth >= 768) {
        visible = 2;
      } else {
        visible = 1;
      }
      
      setVisiblePosts(visible);
      setMaxIndex(Math.max(0, posts.length - visible));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [posts.length]);

  const handleNextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, Math.max(0, posts.length - visiblePosts)));
  };

  const handlePrevSlide = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diffX = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
      if (diffX > 0) {
        // Swiped left
        handleNextSlide();
      } else {
        // Swiped right
        handlePrevSlide();
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold font-display mb-3 text-primary-foreground">{title}</h2>
          {description && <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 z-10 px-2">
            <button
              onClick={handlePrevSlide}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center ${
                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'
              }`}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={handleNextSlide}
              disabled={currentIndex >= maxIndex}
              className={`w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center ${
                currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'
              }`}
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Carousel container */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visiblePosts)}%)`,
                width: `${(posts.length / visiblePosts) * 100}%`
              }}
            >
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="px-3"
                  style={{ width: `${100 / posts.length * visiblePosts}%` }}
                >
                  <article className="scrapbook-paper bg-white/90 h-full flex flex-col">
                    <div className="mb-4">
                      <div className="scrapbook-photo w-full" style={{ '--rotate': `${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 2)}deg` } as React.CSSProperties}>
                        <div className="scrapbook-tape"></div>
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-sm"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary-foreground text-xs rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-display mb-2 leading-tight">
                      <a href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                      <span>{post.date}</span>
                    </div>
                    <a href={`/blog/${post.slug}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                      Read Post
                    </a>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}