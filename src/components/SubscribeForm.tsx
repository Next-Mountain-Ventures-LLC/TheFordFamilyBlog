import React, { useState } from "react";
import { buttonVariants } from "./ui/button";

export default function SubscribeForm() {
  const defaultFormData = { email: "", form_name: "Ford Family Newsletter Subscription" };
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData and add each field
      const form = new FormData();
      
      // Explicitly add each field to ensure they're included
      form.append("email", formData.email);
      form.append("form_name", formData.form_name);
      
      // Log form data for debugging
      console.log("Form submission data:", {
        email: formData.email,
        form_name: formData.form_name
      });
      
      // Ensure the form has the appropriate Content-Type for multipart/form-data
      // The browser will set this automatically when using FormData
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        console.log("Form submission successful");
        setSubmitStatus("success");
        setFormData(defaultFormData);
      } else {
        // Log more details about the failed submission
        const errorText = await response.text();
        console.error("Form submission failed:", {
          status: response.status,
          statusText: response.statusText,
          responseText: errorText
        });
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your email address"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="flex-1 px-3 py-2 border border-border rounded-md bg-white/50"
        />
        <button 
          type="submit" 
          className={buttonVariants({ 
            size: 'default',
            disabled: isSubmitting,
            className: 'whitespace-nowrap'
          })}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      {/* This hidden field ensures the form is properly categorized in your forms list */}
      <input name="form_name" type="hidden" value={formData.form_name} />
      
      {submitStatus === "success" && (
        <div className="p-2 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
          Thank you for subscribing!
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          There was an error. Please try again.
        </div>
      )}
    </form>
  );
}