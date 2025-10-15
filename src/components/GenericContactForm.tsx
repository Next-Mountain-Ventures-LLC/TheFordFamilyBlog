import React, { useState } from "react";
import { buttonVariants } from "./ui/button";

interface GenericContactFormProps {
  formName?: string;
  className?: string;
  buttonText?: string;
  buttonClass?: string;
  darkMode?: boolean;
}

export default function GenericContactForm({
  formName = "Contact Form",
  className = "",
  buttonText = "Send Message",
  buttonClass = "",
  darkMode = false
}: GenericContactFormProps) {
  const defaultFormData = { name: "", email: "", message: "", form_name: formName };
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData(defaultFormData);
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

  const inputClasses = darkMode 
    ? "w-full px-4 py-2 bg-teal-700/50 border border-teal-600 rounded-md text-white placeholder:text-teal-300" 
    : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const labelClasses = darkMode 
    ? "block text-sm font-medium text-teal-100 mb-1" 
    : "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={inputClasses}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={inputClasses}
            placeholder="Your email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={4}
          className={inputClasses}
          placeholder="Your message"
        />
      </div>

      <input name="form_name" type="hidden" value={formData.form_name} />
      
      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonVariants({ 
            disabled: isSubmitting,
            className: buttonClass
          })}
        >
          {isSubmitting ? "Sending..." : buttonText}
        </button>
      </div>

      {submitStatus === "success" && (
        <div className={`p-3 ${darkMode ? 'bg-green-900/50 border border-green-700 text-green-100' : 'bg-green-100 border border-green-400 text-green-700'} rounded`}>
          Message sent successfully!
        </div>
      )}

      {submitStatus === "error" && (
        <div className={`p-3 ${darkMode ? 'bg-red-900/50 border border-red-700 text-red-100' : 'bg-red-100 border border-red-400 text-red-700'} rounded`}>
          There was an error sending your message. Please try again.
        </div>
      )}
    </form>
  );
}