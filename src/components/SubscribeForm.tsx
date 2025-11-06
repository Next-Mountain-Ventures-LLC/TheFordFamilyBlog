import React, { useState, useRef, useEffect } from "react";
import { buttonVariants } from "./ui/button";

export default function SubscribeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  
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
      // Make sure to set form_name in case the form is submitted directly
      setFormData(prev => ({ ...prev, form_name: "Ford Family Newsletter Subscription" }));
      console.log("Moving to step 2 with email:", formData.email);
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Ensure all form fields have proper name attributes
      if (!formRef.current) {
        throw new Error("Form element not found");
      }
      // Use FormData directly from the form element to capture all fields with their name attributes
      const formData = new FormData(formRef.current);
      
      // Get current values for logging and validation
      const email = formData.get("email") as string;
      const firstName = formData.get("first_name") as string;
      const lastName = formData.get("last_name") as string;
      let phone = formData.get("phone") as string;
      
      // Validate required fields are present
      if (!email || !firstName || !lastName) {
        throw new Error("Required fields are missing");
      }
      
      // Process phone number with +1 prefix if not empty
      if (phone && phone.trim()) {
        phone = phone.trim();
        const formattedPhone = phone.startsWith("+1") ? phone : `+1${phone}`;
        // Replace the phone in FormData
        formData.set("phone", formattedPhone);
      }
      
      // Ensure form_name is set correctly
      formData.set("form_name", "Ford Family Newsletter Subscription");
      
      // Log form data for debugging
      console.log("Form submission data:", {
        email: formData.get("email"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        phone: formData.get("phone"),
        form_name: formData.get("form_name"),
        all_entries: Array.from(formData.entries())
      });
      
      console.log("Sending form to endpoint: https://api.new.website/api/submit-form/");
      
      // Send the form data directly to the endpoint
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        body: formData,
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
      
      // Scroll to status message if available
      setTimeout(() => {
        if (statusRef.current) {
          statusRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  
  // Effect to scroll to status message when it appears
  useEffect(() => {
    if (submitStatus && statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [submitStatus]);
  };

  return (
    <form 
      ref={formRef}
      onSubmit={step === 1 ? handleNext : handleSubmit} 
      className="space-y-3" 
      method="POST" 
      action="https://api.new.website/api/submit-form/"
      encType="multipart/form-data"
      autoComplete="on"
      id="newsletter-subscribe-form"
      data-form-type="newsletter"
      name="ford-family-newsletter"
    >
      <div ref={statusRef}>
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
      </div>
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
          {/* Include hidden form_name field in step 1 too */}
          <input type="hidden" name="form_name" value="Ford Family Newsletter Subscription" />
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
          {/* Hidden fields to ensure critical data is included in the final form */}
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="form_name" value="Ford Family Newsletter Subscription" />
          
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
            <p className="text-[10px] text-muted-foreground">+1 will be automatically added to your phone number</p>
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

    </form>
  );
}