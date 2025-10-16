import React, { useState, useRef } from "react";
import { buttonVariants } from "./ui/button";

export default function SubscribeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Define state for form data with the exact field names expected by the API
  const defaultFormData = { 
    email: "", 
    first_name: "", 
    last_name: "", 
    phone: "", 
    form_name: "Ford Family Newsletter Subscription" 
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [step, setStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email before proceeding
    if (formData.email) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData directly from the form element to ensure all fields are included
      const form = formRef.current ? new FormData(formRef.current) : new FormData();
      
      // Just to be sure, also explicitly add each field with the correct field name
      if (!formRef.current) {
        form.append("email", formData.email);
        form.append("first_name", formData.first_name);
        form.append("last_name", formData.last_name);
        form.append("phone", formData.phone || "");
        form.append("form_name", formData.form_name);
      }
      
      // Log form data for debugging
      console.log("Form submission data:", {
        email: form.get("email"),
        first_name: form.get("first_name"),
        last_name: form.get("last_name"),
        phone: form.get("phone"),
        form_name: form.get("form_name")
      });
      
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        console.log("Form submission successful");
        setSubmitStatus("success");
        setFormData(defaultFormData);
        setStep(1);
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
    <form 
      ref={formRef}
      onSubmit={step === 1 ? handleNext : handleSubmit} 
      className="space-y-3" 
      method="POST" 
      action="https://api.new.website/api/submit-form/"
      encType="multipart/form-data"
    >
      {step === 1 ? (
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
            name="next_button"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* This hidden field ensures the email is included when submitting the final form */}
          <input type="hidden" name="email" value={formData.email} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-white/50"
            />
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-white/50"
            />
          </div>
          
          <div className="space-y-1">
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-white/50"
            />
            <p className="text-[10px] text-muted-foreground">Providing your phone helps us send updates faster</p>
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className={buttonVariants({ 
                variant: 'outline',
                size: 'default',
                className: 'whitespace-nowrap'
              })}
              name="back_button"
            >
              Back
            </button>
            <button 
              type="submit" 
              className={buttonVariants({ 
                size: 'default',
                disabled: isSubmitting,
                className: 'whitespace-nowrap'
              })}
              name="submit_button"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Hidden field for form name - this is critical for your form identification */}
      <input type="hidden" name="form_name" value="Ford Family Newsletter Subscription" />
      
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