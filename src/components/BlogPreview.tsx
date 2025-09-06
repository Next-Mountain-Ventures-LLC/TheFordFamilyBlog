import React from 'react';
import { buttonVariants } from './ui/button';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  imageUrl?: string;
  slug: string;
}

interface BlogPreviewProps {
  title: string;
  posts: BlogPost[];
}

export default function BlogPreview({ title, posts }: BlogPreviewProps) {
  return (
    <section className="py-24 bg-muted/10 border-t border-b border-border/20">
      <div className="container px-4">
        <div className="text-center mb-16">
          <div className="mb-1 text-xs uppercase tracking-widest text-primary font-sans font-light animate-on-scroll">Stories & Insights</div>
          <h2 className="text-3xl md:text-4xl font-normal font-display mb-6 animate-on-scroll">{title}</h2>
          <div className="w-16 h-px bg-primary/30 mx-auto mb-6 animate-on-scroll"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light animate-on-scroll">
            Follow our family's journey through stories, insights, and adventures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {posts.map((post, index) => (
            <article 
              key={index} 
              className="scrapbook-paper group transition-all duration-300 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              {post.imageUrl && (
                <div className="mb-6 overflow-hidden">
                  <div className="scrapbook-photo w-full" style={{ '--rotate': `${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 2)}deg` } as React.CSSProperties}>
                    <div className="scrapbook-tape"></div>
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-56 object-cover rounded-sm transition duration-700 ease-in-out group-hover:scale-105"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest font-light border border-border/30 px-3 py-1 text-muted-foreground">
                  {post.category}
                </span>
                <span className="text-xs text-primary/70 font-light">
                  {post.date}
                </span>
              </div>
              
              <h3 className="text-xl font-display font-normal mb-4 group-hover:text-primary transition-colors duration-300">{post.title}</h3>
              <div className="w-12 h-px bg-primary/20 mb-4"></div>
              <p className="text-muted-foreground mb-6 line-clamp-3 font-light">{post.excerpt}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide font-light text-muted-foreground">{post.author}</span>
                <a 
                  href={`/blog/${post.slug}`}
                  className="text-sm uppercase tracking-wide font-light text-primary group-hover:text-primary-foreground transition-colors duration-300 inline-flex items-center"
                >
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-16 text-center animate-on-scroll">
          <div className="w-16 h-px bg-primary/20 mx-auto mb-8"></div>
          <a 
            href="/blog" 
            className="text-sm uppercase tracking-widest font-light text-primary hover:text-primary-foreground transition-colors duration-300 inline-flex items-center border border-primary/30 px-8 py-3 hover:bg-primary/10"
          >
            View All Posts
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