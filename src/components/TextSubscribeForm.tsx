import React, { useState, useRef, useEffect } from "react";
import { buttonVariants } from "./ui/button";
import SubscriptionCategories from "./SubscriptionCategories";
import { Facebook, Mail, MessageCircle } from "lucide-react";

export default function TextSubscribeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  
  // Define state for form data with the exact field names expected by the API
  const defaultFormData = { 
    email: "", 
    first_name: "", 
    last_name: "", 
    phone: "",
    subscription_categories: ["family_updates"],
    form_name: "Ford Family Text Subscription" 
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
    
    // Scroll to top of form to ensure user sees status message later
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      // Get the form element directly
      const formElement = formRef.current as HTMLFormElement;
      
      // Create a fresh FormData object
      const formDataObj = new FormData();
      
      // Ensure all fields are included in the FormData with the correct names
      formDataObj.set("email", formData.email);
      formDataObj.set("first_name", formData.first_name);
      formDataObj.set("last_name", formData.last_name);
      
      // Always process phone number, even if empty
      const phoneNumber = formData.phone.trim();
      // If phone is provided, ensure it has +1 prefix
      if (phoneNumber) {
        const formattedPhone = phoneNumber.startsWith("+1") ? phoneNumber : `+1${phoneNumber}`;
        formDataObj.set("phone", formattedPhone);
      }
      
      // Map the categories to their proper category names
      const categoryMapping = {
        family_updates: "family updates",
        health_updates: "health updates",
        prayer_request: "prayer requests",
        business_ventures: "business ventures"
      };
      
      // Get the selected categories
      const selectedCategories = formData.subscription_categories;
      const categoryCount = selectedCategories.length;
      
      // Add the count of categories
      formDataObj.append("subscription_categories_count", String(categoryCount));
      
      // For each selected category, add it to the subscription_category_N field
      selectedCategories.forEach((categoryId, index) => {
        // Only send the properly mapped category name
        if (categoryMapping[categoryId as keyof typeof categoryMapping]) {
          formDataObj.append(`subscription_category_${index + 1}`, categoryMapping[categoryId as keyof typeof categoryMapping]);
        }
      });
      
      // Make sure form_name is properly set
      formDataObj.set("form_name", "Ford Family Text Subscription");
      
      // Log form data for debugging
      console.log("Form submission data:", {
        email: formDataObj.get("email"),
        first_name: formDataObj.get("first_name"),
        last_name: formDataObj.get("last_name"),
        phone: formDataObj.get("phone"),
        subscription_categories_count: formDataObj.get("subscription_categories_count"),
        form_name: formDataObj.get("form_name"),
        // Show each category assignment
        ...Array.from({length: selectedCategories.length}, (_, i) => {
          const key = `subscription_category_${i + 1}`;
          return { [key]: formDataObj.get(key) };
        }).reduce((acc, curr) => ({...acc, ...curr}), {})
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
      
      // Scroll to the top of the page after state updates
      setTimeout(() => {
        // Scroll to the very top of the page for maximum visibility of the success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };
  
  // Effect to scroll to top of the page when status changes
  useEffect(() => {
    if (submitStatus) {
      // Scroll to the top of the page for maximum visibility of the success/error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitStatus]);

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
      name="ford-family-text-subscription"
    >
      <div ref={statusRef}>
        {submitStatus === "success" && (
          <div className="p-4 mb-6 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="font-medium text-lg">Thank you for subscribing!</p>
            <p className="text-base mt-1 mb-3">You'll start receiving updates based on your preferences.</p>
            
            <div className="mt-4">
              <p className="text-base font-medium mb-3">Do you know anyone who would like to receive updates about the Ford family? Click below to share this sign up page.</p>
              <div className="flex items-center gap-3">
                {/* Facebook Message */}
                <a 
                  href={`https://www.facebook.com/dialog/send?app_id=741024618086022&link=${encodeURIComponent(window.location.href)}&redirect_uri=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  aria-label="Share on Facebook Messenger"
                >
                  <Facebook size={22} />
                </a>
                
                {/* SMS Share */}
                <a 
                  href={`sms:?body=Hey, this is the sign up for the Ford Family to receive updates about Salicia and the family. You should check it out too: ${encodeURIComponent(window.location.href)}`}
                  className="flex items-center justify-center p-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  aria-label="Share via SMS"
                >
                  <MessageCircle size={22} />
                </a>
                
                {/* Email Share */}
                <a 
                  href={`mailto:?subject=Subscribe to the Ford Family Updates&body=Hey,%0A%0AI wanted to invite you to subscribe to the Ford Family blog.%0A%0AYou can sign up here: ${encodeURIComponent(window.location.href)}%0A%0AThanks!`}
                  className="flex items-center justify-center p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                  aria-label="Share via Email"
                >
                  <Mail size={22} />
                </a>
              </div>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-medium text-base">There was an error processing your subscription.</p>
            <p className="text-sm mt-1">Please try again or contact us directly.</p>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="first_name" className="block text-base font-medium mb-1">
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
              className="w-full px-3 py-3 text-base border border-border rounded-md bg-white/50"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-base font-medium mb-1">
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
              className="w-full px-3 py-3 text-base border border-border rounded-md bg-white/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-base font-medium mb-1">
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
          <label htmlFor="phone" className="block text-base font-medium mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-white/50"
          />
          <p className="text-base text-muted-foreground mt-1">
            We'll send updates directly to your phone (+1 will be automatically added)
          </p>
        </div>
        
        {/* Include hidden form_name field */}
        <input type="hidden" name="form_name" value="Ford Family Text Subscription" />
      </div>
      
      <div className="pt-2">
        <SubscriptionCategories 
          onChange={handleCategoriesChange}
          defaultSelected={['family_updates']}
        />
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

    </form>
  );
}