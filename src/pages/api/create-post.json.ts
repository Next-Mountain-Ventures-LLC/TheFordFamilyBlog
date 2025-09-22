import type { APIRoute } from "astro";
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to blog content directory
const contentDir = path.join(__dirname, '../../../content/blog');

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'content', 'author', 'category'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Missing required field: ${field}` 
          }),
          { status: 400 }
        );
      }
    }
    
    // Generate slug from title
    const slug = formData.slug || formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Generate unique ID for filename
    const randomId = Math.random().toString(36).substring(2, 10);
    
    // Set default values
    const date = formData.date || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const imageUrl = formData.imageUrl || 
      "https://images.unsplash.com/photo-1586442454519-44e70bd51f82?w=800&auto=format&fit=crop&q=80";
    
    // Create frontmatter content
    const frontmatter = `---
title: "${formData.title}"
description: "${formData.description}"
date: "${date}"
author: "${formData.author}"
category: "${formData.category}"
imageUrl: "${imageUrl}"
slug: "${slug}"
---

${formData.content}`;

    // Filename with unique ID
    const filename = `${slug}_nw_${randomId}.md`;
    const filePath = path.join(contentDir, filename);
    
    // Ensure content directory exists
    await fs.mkdir(contentDir, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, frontmatter, 'utf-8');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog post created successfully',
        slug,
        filename
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog post:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error creating blog post',
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
};