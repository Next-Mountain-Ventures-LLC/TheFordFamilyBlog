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
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-10 text-center text-primary-foreground animate-on-scroll">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article 
              key={index} 
              className="scrapbook-paper hover:shadow-lg transition-shadow duration-300 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              {post.imageUrl && (
                <div className="mb-4">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-sm"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground">
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {post.date} • {post.author}
                </span>
              </div>
              
              <h3 className="text-xl font-bold font-display mb-2 text-primary-foreground">{post.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
              
              <a 
                href={`/blog/${post.slug}`}
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Read More
              </a>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center animate-on-scroll">
          <a 
            href="/blog" 
            className={buttonVariants({ variant: 'outline' })}
          >
            View All Posts
          </a>
        </div>
      </div>
    </section>
  );
}