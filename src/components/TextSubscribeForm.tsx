import React, { useState, useRef } from "react";
import { buttonVariants } from "./ui/button";
import SubscriptionCategories from "./SubscriptionCategories";

export default function TextSubscribeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Define state for form data with the exact field names expected by the API
  const defaultFormData = { 
    email: "", 
    first_name: "", 
    last_name: "", 
    phone: "",
    subscription_categories: ["family_updates"],
    form_name: "Friends and Family Form" 
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (selectedCategories: string[]) => {
    setFormData(prev => ({ ...prev, subscription_categories: selectedCategories }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Get the form element directly and use it to create a FormData object
      const formElement = formRef.current as HTMLFormElement;
      const formDataObj = new FormData(formElement);
      
      // Process phone number to ensure it has +1 prefix
      if (formDataObj.has("phone")) {
        const phoneNumber = (formDataObj.get("phone") as string).trim();
        if (phoneNumber) {
          const formattedPhone = phoneNumber.startsWith("+1") ? phoneNumber : `+1${phoneNumber}`;
          formDataObj.set("phone", formattedPhone);
        }
      }
      
      // Make sure subscription categories are included properly
      // The hidden inputs might not capture this correctly, so we'll add them explicitly
      formData.subscription_categories.forEach(category => {
        formDataObj.append("subscription_categories[]", category);
      });
      
      // The form_name field is already included as a hidden input in the form
      
      // Log form data for debugging
      console.log("Form submission data:", {
        email: formDataObj.get("email"),
        first_name: formDataObj.get("first_name"),
        last_name: formDataObj.get("last_name"),
        phone: formDataObj.get("phone"),
        subscription_categories: formData.subscription_categories,
        form_name: formDataObj.get("form_name")
      });
      
      console.log("Sending form to endpoint: https://api.new.website/api/submit-form/");
      
      // Send the form data directly to the endpoint
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        body: formDataObj,
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
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="space-y-6" 
      method="POST" 
      action="https://api.new.website/api/submit-form/"
      encType="multipart/form-data"
      autoComplete="on"
      id="text-subscribe-form"
      data-form-type="newsletter"
      name="friends-and-family-form"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Your first name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-white/50"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Your last name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-white/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-white/50"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              +1
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full pl-9 px-3 py-2 border border-border rounded-md bg-white/50"
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            We'll send updates directly to your phone (+1 will be automatically added)
          </p>
        </div>
        
        {/* Include hidden form_name field */}
        <input type="hidden" name="form_name" value="Friends and Family Form" />
      </div>
      
      <div className="pt-2">
        <SubscriptionCategories 
          onChange={handleCategoriesChange}
          defaultSelected={['family_updates']}
        />
        
        {/* Hidden inputs for selected categories */}
        {formData.subscription_categories.map(category => (
          <input 
            key={category} 
            type="hidden" 
            name="subscription_categories[]" 
            value={category}
          />
        ))}
      </div>

      <div className="pt-4">
        <button 
          type="submit" 
          className={buttonVariants({ 
            size: 'lg',
            disabled: isSubmitting,
            className: 'w-full'
          })}
          name="submit_button"
        >
          {isSubmitting ? "Submitting..." : "Subscribe Now"}
        </button>
      </div>

      {submitStatus === "success" && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
          <p className="font-medium">Thank you for subscribing!</p>
          <p className="text-xs mt-1">You'll start receiving updates based on your preferences.</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          <p className="font-medium">There was an error processing your subscription.</p>
          <p className="text-xs mt-1">Please try again or contact us directly.</p>
        </div>
      )}
    </form>
  );
}