import React, { useState } from "react";
import { Button } from "./ui/button";

export default function ContactForm() {
  const defaultFormData = {name: "", email: "", message: "", form_name: "Contact Form"};
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
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData(defaultFormData);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-muted/5 border-t border-border/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-1 text-xs uppercase tracking-widest text-primary font-sans font-light">Get in Touch</div>
            <h2 className="text-3xl md:text-4xl font-normal font-display mb-6">Connect With Us</h2>
            <div className="w-16 h-px bg-primary/30 mx-auto mb-6"></div>
            <p className="text-muted-foreground font-light">
              Have a question or just want to say hello? We'd love to hear from you!
            </p>
          </div>
          
          <div className="scrapbook-paper">
            <form onSubmit={handleSubmit} className="space-y-8" data-form-type="utility">
              <div>
                <label htmlFor="name" className="block text-sm font-light uppercase tracking-wide mb-2 text-muted-foreground">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border/30 bg-background/50 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-light uppercase tracking-wide mb-2 text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border/30 bg-background/50 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-light uppercase tracking-wide mb-2 text-muted-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-border/30 bg-background/50 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                />
              </div>

              <input name="form_name" type="hidden" value={formData.form_name} />
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-sm uppercase tracking-widest font-light w-full text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-300 px-8 py-3 flex justify-center items-center"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>

              {submitStatus === "success" && (
                <div className="mt-4 p-4 border border-green-300 text-green-800 bg-green-50/50">
                  Form submitted successfully! We'll be in touch soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mt-4 p-4 border border-red-300 text-red-800 bg-red-50/50">
                  There was an error submitting the form. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}