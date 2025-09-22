import React, { useState } from "react";
import { Button } from "./ui/button";

interface Category {
  name: string;
  count: number;
}

interface BlogPostFormProps {
  categories: Category[];
}

export default function BlogPostForm({ categories }: BlogPostFormProps) {
  const defaultFormData = {
    title: "",
    description: "",
    content: "",
    category: "",
    imageUrl: "https://images.unsplash.com/photo-1586442454519-44e70bd51f82?w=800&auto=format&fit=crop&q=80",
    author: "",
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    // In a real app, you would send this to the server
    // For this demo, we'll just clear the input and let the user select it
    setNewCategory("");
  };
  
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.content || !formData.category || !formData.author) {
      setSubmitStatus("error");
      setErrorMessage("Please fill out all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const slug = generateSlug(formData.title);
      
      // Send data to the API endpoint
      const response = await fetch('/api/create-post.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create blog post');
      }
      
      // For demo purposes, also store in localStorage to show in admin interface
      // even if actual file writing fails in the API
      localStorage.setItem(`blog_${data.slug}`, JSON.stringify({
        ...formData,
        slug,
        createdAt: new Date().toISOString()
      }));
      
      setSubmitStatus("success");
      
      // Redirect to the dashboard after successful submission
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1500);
    } catch (error) {
      console.error("Error submitting blog post:", error);
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "There was an error creating the blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === "success" && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Post created successfully! Redirecting to dashboard...
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage || "There was an error submitting the form. Please try again."}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Post Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter post title"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter author name"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Publication Date
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Format: Month DD, YYYY"
          />
          <p className="text-xs text-gray-500">Today's date is used by default</p>
        </div>

        <div className="space-y-4 md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Post Description/Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="A brief summary of your post (displayed in previews)"
          />
        </div>

        <div className="space-y-4 md:col-span-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Post Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Write your blog post content here (supports Markdown)"
          />
          <p className="text-xs text-gray-500">
            You can use Markdown for formatting. 
            <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Learn Markdown syntax
            </a>
          </p>
        </div>

        <div className="space-y-4 md:col-span-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          
          <div className="flex gap-2">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
              {newCategory && <option value={newCategory}>{newCategory} (new)</option>}
            </select>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
                className="w-32 md:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button 
                type="button"
                onClick={handleAddCategory}
                variant="outline"
                size="sm"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Featured Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500">
            Enter a URL for the featured image. A default image is provided.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button
          type="button"
          onClick={() => window.location.href = "/admin/dashboard"}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </Button>
      </div>
    </form>
  );
}