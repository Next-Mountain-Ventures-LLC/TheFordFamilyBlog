import React, { useState } from "react";
import { Button } from "./ui/button";

export default function FinleyContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData from the form
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // Ensure form_name is included
      if (!formData.has('form_name')) {
        formData.append('form_name', 'Finley Contact Form');
      }

      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        body: formData, // FormData automatically sets the correct Content-Type
      });

      if (response.ok) {
        setSubmitStatus("success");
        form.reset();
      } else {
        console.error("Form submission failed:", await response.text());
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required
            className="w-full px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-md text-gray-900 placeholder:text-pink-300 focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required
            className="w-full px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-md text-gray-900 placeholder:text-pink-300 focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
            placeholder="Your email"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea 
          id="message" 
          name="message" 
          rows={4} 
          required
          className="w-full px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-md text-gray-900 placeholder:text-pink-300 focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
          placeholder="Your message"
        ></textarea>
      </div>
      <input type="hidden" name="form_name" value="Finley Contact Form" />

      <div className="text-center">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-pink-500 hover:bg-pink-600 text-white border-none"
          size="lg"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </div>

      {submitStatus === "success" && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded-md mt-4">
          Thank you for your message! I'll get back to you soon.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-md mt-4">
          There was an error sending your message. Please try again later.
        </div>
      )}
    </form>
  );
}