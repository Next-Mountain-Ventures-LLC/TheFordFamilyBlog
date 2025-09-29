// WordPress API integration for blog.thefordfamily.life

const API_URL = 'https://blog.thefordfamily.life/wp-json/wp/v2';

export interface WordPressPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  slug: string;
  featured_media: number;
  jetpack_featured_media_url?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          thumbnail?: { source_url?: string };
          medium?: { source_url?: string };
          large?: { source_url?: string };
          full?: { source_url?: string };
          [key: string]: { source_url?: string } | undefined;
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
    }>;
    replies?: Array<Array<any>>;
  };
  categories: number[];
  tags: number[];
  author: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  slug: string;
}

/**
 * Transforms a WordPress post to our blog post format
 */
export function transformWordPressPost(post: WordPressPost): BlogPost {
  // Get the featured image URL if available
  let imageUrl = 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&auto=format&q=80';
  
  // Check different paths where the image might be found in the WordPress response
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
  } else if (post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url) {
    imageUrl = post._embedded['wp:featuredmedia'][0].media_details.sizes.large.source_url;
  } else if (post.jetpack_featured_media_url) {
    imageUrl = post.jetpack_featured_media_url;
  }
  
  console.log(`Featured image for post ${post.slug}:`, imageUrl);

  // Get the first category name
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';

  // Get the author name
  const author = post._embedded?.author?.[0]?.name || 'Ford Family';

  // Format the date
  const dateObj = new Date(post.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  // Strip HTML from excerpt
  const stripHtml = (html: string) => {
    if (typeof DOMParser !== 'undefined') {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    } else {
      // Simple fallback for server-side rendering
      return html.replace(/<[^>]*>?/gm, '');
    }
  };

  // Create formatted blog post
  return {
    id: post.id,
    title: post.title.rendered,
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    date: formattedDate,
    author: author,
    category: category,
    imageUrl: imageUrl,
    slug: post.slug,
  };
}

/**
 * Fetches posts from WordPress API
 */
export async function getPosts(limit = 10): Promise<BlogPost[]> {
  try {
    console.log(`Fetching posts from: ${API_URL}/posts?_embed&per_page=${limit}`);
    
    const response = await fetch(
      `${API_URL}/posts?_embed&per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`API response not OK: Status ${response.status}`);
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    console.log(`Successfully fetched ${posts.length} posts`);
    return posts.map(transformWordPressPost);
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    throw error; // Rethrow so we can handle the error in the component
  }
}

/**
 * Fetches a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log(`Fetching post with slug '${slug}' from: ${API_URL}/posts?slug=${slug}&_embed`);
    
    const response = await fetch(
      `${API_URL}/posts?slug=${slug}&_embed`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`API response not OK for slug ${slug}: Status ${response.status}`);
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    console.log(`API response for slug ${slug}:`, posts.length ? 'Post found' : 'No posts found');
    
    if (posts.length === 0) {
      return null;
    }
    
    return transformWordPressPost(posts[0]);
  } catch (error) {
    console.error(`Error fetching WordPress post by slug ${slug}:`, error);
    throw error; // Rethrow so we can handle the error in the component
  }
}

/**
 * Fetches posts by category
 */
export async function getPostsByCategory(category: string, limit = 10): Promise<BlogPost[]> {
  try {
    // First get the category ID
    const catResponse = await fetch(
      `${API_URL}/categories?slug=${category}`
    );

    if (!catResponse.ok) {
      throw new Error(`Failed to fetch category: ${catResponse.status}`);
    }

    const categories = await catResponse.json();
    
    if (categories.length === 0) {
      return [];
    }

    const categoryId = categories[0].id;

    // Then fetch posts by category ID
    const response = await fetch(
      `${API_URL}/posts?_embed&categories=${categoryId}&per_page=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts by category: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    return posts.map(transformWordPressPost);
  } catch (error) {
    console.error(`Error fetching WordPress posts for category ${category}:`, error);
    return [];
  }
}

/**
 * Fetches featured posts
 */
export async function getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
  try {
    // Assuming you use a tag "featured" for featured posts
    const tagResponse = await fetch(
      `${API_URL}/tags?slug=featured`
    );

    if (!tagResponse.ok) {
      throw new Error(`Failed to fetch featured tag: ${tagResponse.status}`);
    }

    const tags = await tagResponse.json();
    
    if (tags.length === 0) {
      // Fall back to regular posts if no featured tag exists
      return getPosts(limit);
    }

    const tagId = tags[0].id;

    const response = await fetch(
      `${API_URL}/posts?_embed&tags=${tagId}&per_page=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch featured posts: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    return posts.map(transformWordPressPost);
  } catch (error) {
    console.error('Error fetching featured WordPress posts:', error);
    // Fallback to regular posts
    return getPosts(limit);
  }
}