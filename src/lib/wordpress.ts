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
  authorId?: number;
  authorSlug?: string;
  category: string;
  categoryId?: number;
  categorySlug?: string;
  tags?: Array<{id: number, name: string, slug: string}>;
  imageUrl?: string;
  slug: string;
}

/**
 * Transforms a WordPress post to our blog post format
 */
/**
 * Maps email-based author identifiers to their full names
 */
export function getAuthorFullName(authorName: string): string {
  // Map of email usernames to full names
  const authorMap: Record<string, string> = {
    'salicia': 'Salicia Ford',
    'joshua': 'Joshua Ford',
    'jackson': 'Jackson Ford',
    'finley': 'Finley Ford'
  };

  // Check if the author name contains an email pattern
  if (authorName.includes('@thefordfamily.life')) {
    // Extract username from the email
    const username = authorName.split('@')[0].toLowerCase();
    return authorMap[username] || authorName; // Return mapped name or original if not found
  }

  return authorName; // Return original name if not an email
}

/**
 * Transforms a WordPress post to our blog post format
 */
export function transformWordPressPost(post: WordPressPost): BlogPost {
  // Get the featured image URL if available from WordPress
  let imageUrl: string | null = null;
  
  // Check different paths where the image might be found in the WordPress response
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
  } else if (post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url) {
    imageUrl = post._embedded['wp:featuredmedia'][0].media_details.sizes.large.source_url;
  } else if (post.jetpack_featured_media_url) {
    imageUrl = post.jetpack_featured_media_url;
  }
  
  // Only log if we found an image
  if (imageUrl) {
    console.log(`Featured image for post ${post.slug}:`, imageUrl);
  } else {
    console.log(`No featured image found for post ${post.slug}`);
  }
  
  console.log(`Featured image for post ${post.slug}:`, imageUrl);

  // Get category data
  const categoryData = post._embedded?.['wp:term']?.[0]?.[0];
  const category = categoryData?.name || 'Uncategorized';
  const categoryId = categoryData?.id;
  const categorySlug = categoryData?.slug;

  // Get tags data
  const tags = post._embedded?.['wp:term']?.[1]?.map(tag => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug
  })) || [];

  // Get author data
  const authorData = post._embedded?.author?.[0];
  let author = authorData?.name || 'Ford Family';
  // Apply author mapping for emails
  author = getAuthorFullName(author);
  const authorId = authorData?.id || post.author;
  const authorSlug = authorData?.slug;

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
  const blogPost: BlogPost = {
    id: post.id,
    title: post.title.rendered,
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    date: formattedDate,
    author: author,
    authorId: authorId,
    authorSlug: authorSlug,
    category: category,
    categoryId: categoryId,
    categorySlug: categorySlug,
    tags: tags,
    slug: post.slug,
  };
  
  // Only add imageUrl if we have a valid image from WordPress
  if (imageUrl) {
    blogPost.imageUrl = imageUrl;
  }
  
  return blogPost;
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
        // Bypass cache to get fresh content
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

/**
 * WordPress Category interface
 */
export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

/**
 * Fetches all categories from WordPress API
 */
export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    console.log(`Fetching categories from: ${API_URL}/categories?per_page=100`);
    
    const response = await fetch(
      `${API_URL}/categories?per_page=100`,
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
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const categories: WordPressCategory[] = await response.json();
    console.log(`Successfully fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('Error fetching WordPress categories:', error);
    throw error;
  }
}

/**
 * Fetches a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<WordPressCategory | null> {
  try {
    console.log(`Fetching category with slug '${slug}' from: ${API_URL}/categories?slug=${slug}`);
    
    const response = await fetch(
      `${API_URL}/categories?slug=${slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`API response not OK for category slug ${slug}: Status ${response.status}`);
      throw new Error(`Failed to fetch category: ${response.status}`);
    }

    const categories: WordPressCategory[] = await response.json();
    
    if (categories.length === 0) {
      return null;
    }
    
    return categories[0];
  } catch (error) {
    console.error(`Error fetching WordPress category by slug ${slug}:`, error);
    throw error;
  }
}

/**
 * WordPress Author interface
 */
export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [size: string]: string;
  };
}

/**
 * Fetches all authors from WordPress API
 */
export async function getAuthors(): Promise<WordPressAuthor[]> {
  try {
    console.log(`Fetching authors from: ${API_URL}/users?per_page=100`);
    
    const response = await fetch(
      `${API_URL}/users?per_page=100`,
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
      throw new Error(`Failed to fetch authors: ${response.status}`);
    }

    const authors: WordPressAuthor[] = await response.json();
    console.log(`Successfully fetched ${authors.length} authors`);
    return authors;
  } catch (error) {
    console.error('Error fetching WordPress authors:', error);
    throw error;
  }
}

/**
 * Fetches a single author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<WordPressAuthor | null> {
  try {
    console.log(`Fetching author with slug '${slug}' from: ${API_URL}/users?slug=${slug}`);
    
    const response = await fetch(
      `${API_URL}/users?slug=${slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`API response not OK for author slug ${slug}: Status ${response.status}`);
      throw new Error(`Failed to fetch author: ${response.status}`);
    }

    const authors: WordPressAuthor[] = await response.json();
    
    if (authors.length === 0) {
      return null;
    }
    
    return authors[0];
  } catch (error) {
    console.error(`Error fetching WordPress author by slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetches posts by author ID or name
 */
export async function getPostsByAuthor(authorIdOrName: number | string, limit = 10): Promise<BlogPost[]> {
  try {
    let queryParam: string;
    
    // If authorIdOrName is a number, use it directly as the author ID
    if (typeof authorIdOrName === 'number') {
      queryParam = `author=${authorIdOrName}`;
    } 
    // If it's a string but represents a number, convert and use as ID
    else if (!isNaN(Number(authorIdOrName))) {
      queryParam = `author=${authorIdOrName}`;
    }
    // Otherwise, search posts and filter by author name
    else {
      queryParam = `_embed`; // We'll filter by author name after fetching
    }
    
    console.log(`Fetching posts for author "${authorIdOrName}" from: ${API_URL}/posts?${queryParam}&per_page=${limit}`);
    
    const response = await fetch(
      `${API_URL}/posts?${queryParam}&per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`API response not OK for author "${authorIdOrName}": Status ${response.status}`);
      throw new Error(`Failed to fetch posts by author: ${response.status}`);
    }

    let posts: WordPressPost[] = await response.json();
    
    // If we're searching by author name (string), filter the results
    if (typeof authorIdOrName === 'string' && isNaN(Number(authorIdOrName))) {
      const authorName = authorIdOrName;
      // Check both raw author name and mapped name (for email addresses)
      posts = posts.filter(post => {
        const postAuthor = post._embedded?.author?.[0]?.name || '';
        const mappedAuthor = getAuthorFullName(postAuthor);
        
        return (
          // Check if either the original or mapped author name contains the search term
          postAuthor.toLowerCase().includes(authorName.toLowerCase()) ||
          mappedAuthor.toLowerCase().includes(authorName.toLowerCase())
        );
      });
    }
    
    console.log(`Successfully fetched ${posts.length} posts for author "${authorIdOrName}"`);
    return posts.map(transformWordPressPost);
  } catch (error) {
    console.error(`Error fetching WordPress posts for author "${authorIdOrName}":`, error);
    return []; // Return empty array instead of throwing to avoid breaking profile pages
  }
}

/**
 * WordPress Tag interface
 */
export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

/**
 * Fetches all tags from WordPress API
 */
export async function getTags(): Promise<WordPressTag[]> {
  try {
    console.log(`Fetching tags from: ${API_URL}/tags?per_page=100`);
    
    const response = await fetch(
      `${API_URL}/tags?per_page=100`,
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
      throw new Error(`Failed to fetch tags: ${response.status}`);
    }

    const tags: WordPressTag[] = await response.json();
    console.log(`Successfully fetched ${tags.length} tags`);
    return tags;
  } catch (error) {
    console.error('Error fetching WordPress tags:', error);
    throw error;
  }
}

/**
 * Fetches a single tag by slug
 */
export async function getTagBySlug(slug: string): Promise<WordPressTag | null> {
  try {
    console.log(`Fetching tag with slug '${slug}' from: ${API_URL}/tags?slug=${slug}`);
    
    const response = await fetch(
      `${API_URL}/tags?slug=${slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`API response not OK for tag slug ${slug}: Status ${response.status}`);
      throw new Error(`Failed to fetch tag: ${response.status}`);
    }

    const tags: WordPressTag[] = await response.json();
    
    if (tags.length === 0) {
      return null;
    }
    
    return tags[0];
  } catch (error) {
    console.error(`Error fetching WordPress tag by slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetches posts by tag ID
 */
export async function getPostsByTag(tagId: number, limit = 10): Promise<BlogPost[]> {
  try {
    console.log(`Fetching posts by tag ID ${tagId} from: ${API_URL}/posts?_embed&tags=${tagId}&per_page=${limit}`);
    
    const response = await fetch(
      `${API_URL}/posts?_embed&tags=${tagId}&per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`API response not OK for tag ID ${tagId}: Status ${response.status}`);
      throw new Error(`Failed to fetch posts by tag: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    console.log(`Successfully fetched ${posts.length} posts by tag ID ${tagId}`);
    return posts.map(transformWordPressPost);
  } catch (error) {
    console.error(`Error fetching WordPress posts by tag ID ${tagId}:`, error);
    throw error;
  }
}