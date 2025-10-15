import React, { useState } from 'react';
import { buttonVariants } from './ui/button';

const ITEM_CATEGORIES = [
  "Clothing",
  "Shoes",
  "Organizing Items",
  "Wall Art",
  "Kitchenware",
  "Toys",
  "Baby Items",
  "Houseware",
  "Bean Bag",
  "Desk",
  "Books",
  "Blankets",
  "Bookshelf"
];

const CLOTHING_TYPES = ["Men's", "Women's", "Boys", "Girls"];
const SHOE_TYPES = ["Men's", "Women's", "Boys", "Girls"];

export default function RequestItemForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    pickupDate: '',
    pickupTime: ''
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showClothingSizes, setShowClothingSizes] = useState(false);
  const [showShoeSizes, setShowShoeSizes] = useState(false);
  const [clothingSizes, setClothingSizes] = useState<{type: string, sizes: string}[]>([]);
  const [shoeSizes, setShoeSizes] = useState<{type: string, sizes: string}[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
      
      if (category === 'Clothing') {
        setShowClothingSizes(false);
        setClothingSizes([]);
      }
      if (category === 'Shoes') {
        setShowShoeSizes(false);
        setShoeSizes([]);
      }
    } else {
      setSelectedCategories(prev => [...prev, category]);
      
      if (category === 'Clothing') {
        setShowClothingSizes(true);
      }
      if (category === 'Shoes') {
        setShowShoeSizes(true);
      }
    }
  };

  const addClothingSize = () => {
    setClothingSizes(prev => [...prev, { type: 'Men\'s', sizes: '' }]);
  };

  const addShoeSize = () => {
    setShoeSizes(prev => [...prev, { type: 'Men\'s', sizes: '' }]);
  };

  const updateClothingType = (index: number, type: string) => {
    setClothingSizes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], type };
      return updated;
    });
  };

  const updateClothingSizes = (index: number, sizes: string) => {
    setClothingSizes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], sizes };
      return updated;
    });
  };

  const updateShoeType = (index: number, type: string) => {
    setShoeSizes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], type };
      return updated;
    });
  };

  const updateShoeSizes = (index: number, sizes: string) => {
    setShoeSizes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], sizes };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // In a real implementation, we would submit the form data to an API
      // For now, we'll simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        pickupDate: '',
        pickupTime: ''
      });
      setSelectedCategories([]);
      setShowClothingSizes(false);
      setShowShoeSizes(false);
      setClothingSizes([]);
      setShoeSizes([]);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="scrapbook-paper bg-primary/5 text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-primary mb-4">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h3 className="text-2xl font-display font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
          We've received your request and will get back to you as soon as possible. Your openness about your needs helps us connect you with the right items.
        </p>
        <button 
          onClick={() => setFormSubmitted(false)}
          className={buttonVariants({ variant: 'outline' })}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="scrapbook-paper bg-white/90">
      <h2 className="font-display text-2xl font-bold mb-1 text-primary-foreground">Request Free Items</h2>
      <p className="text-muted-foreground mb-6 text-sm font-medium">
        Submissions Due By Friday, Oct. 27th
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6" data-form-type="utility">
        <input type="hidden" name="form_name" value="Free Stuff Request" />
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50" 
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                required
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-display font-medium">What items do you need? *</h3>
          <div className="flex flex-wrap gap-2">
            {ITEM_CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  selectedCategories.includes(category)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {selectedCategories.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Please select at least one category</p>
          )}
        </div>
        
        {/* Clothing Sizes Section */}
        {showClothingSizes && (
          <div className="p-4 bg-muted/30 rounded-md space-y-4 border border-border">
            <h3 className="font-medium">Clothing Sizes Needed</h3>
            
            {clothingSizes.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <select
                  value={item.type}
                  onChange={(e) => updateClothingType(index, e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-white/80"
                >
                  {CLOTHING_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Sizes needed (e.g., S, M, L, XL)"
                    value={item.sizes}
                    onChange={(e) => updateClothingSizes(index, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-white/80"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addClothingSize}
              className={`${buttonVariants({ variant: 'outline', size: 'sm' })} w-full sm:w-auto`}
            >
              + Add More Clothing Sizes
            </button>
            
            {clothingSizes.length === 0 && (
              <button
                type="button"
                onClick={addClothingSize}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                + Add Clothing Sizes
              </button>
            )}
          </div>
        )}
        
        {/* Shoe Sizes Section */}
        {showShoeSizes && (
          <div className="p-4 bg-muted/30 rounded-md space-y-4 border border-border">
            <h3 className="font-medium">Shoe Sizes Needed</h3>
            
            {shoeSizes.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <select
                  value={item.type}
                  onChange={(e) => updateShoeType(index, e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-white/80"
                >
                  {SHOE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Sizes needed (e.g., 7, 8, 9, 10)"
                    value={item.sizes}
                    onChange={(e) => updateShoeSizes(index, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-white/80"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addShoeSize}
              className={`${buttonVariants({ variant: 'outline', size: 'sm' })} w-full sm:w-auto`}
            >
              + Add More Shoe Sizes
            </button>
            
            {shoeSizes.length === 0 && (
              <button
                type="button"
                onClick={addShoeSize}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                + Add Shoe Sizes
              </button>
            )}
          </div>
        )}
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Tell Us About Your Needs</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Please share a little about yourself and your situation. This helps us better understand how we can assist you."
            className="w-full px-3 py-2 border border-border rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
          ></textarea>
          <p className="text-sm text-muted-foreground mt-1">
            We're not an organization, we're just a family trying to help other families.
          </p>
        </div>
        
        {/* Pickup Date/Time Section */}
        <div className="p-4 bg-muted/30 rounded-md space-y-4 border border-border">
          <h3 className="font-medium">Select Pickup Date & Time <span className="text-sm text-muted-foreground">(1107 S. Clay St, Ennis, TX 75119)</span></h3>
          <p className="text-sm text-muted-foreground mb-2">Please note: We'll do our best to accommodate your selected time, but we may need to arrange an alternative time based on availability.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium mb-1">Preferred Date *</label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                max="2025-10-18"
                className="w-full px-3 py-2 border border-border rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            
            <div>
              <label htmlFor="pickupTime" className="block text-sm font-medium mb-1">Preferred Time *</label>
              <select
                id="pickupTime"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange as React.ChangeEventHandler<HTMLSelectElement>}
                className="w-full px-3 py-2 border border-border rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              >
                <option value="">Select a time</option>
                <option value="Morning (9am-12pm)">Morning (9am-12pm)</option>
                <option value="Afternoon (12pm-5pm)">Afternoon (12pm-5pm)</option>
                <option value="Evening (5pm-7pm)">Evening (5pm-7pm)</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={submitting || selectedCategories.length === 0}
          className={`${buttonVariants({ size: 'lg' })} w-full sm:w-auto ${
            submitting || selectedCategories.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
        <p className="italic">
          "It is more blessed to give than to receive." - Acts 20:35
        </p>
      </div>
    </div>
  );
}