import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Users, HeartPulse, HandHeart, Store, Check, ArrowDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  special?: boolean;
}

interface SubscriptionCategoriesProps {
  onChange: (selectedCategories: string[]) => void;
  defaultSelected?: string[];
  isPrayerMode?: boolean;
}

export default function SubscriptionCategories({ onChange, defaultSelected = ['family_updates'], isPrayerMode = false }: SubscriptionCategoriesProps) {
  // Set initial default selected categories based on prayer mode
  const initialSelected = isPrayerMode ? ['prayer_request'] : defaultSelected;
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelected);
  
  // Check URL for prayer parameter on component mount
  useEffect(() => {
    // Only do this client-side
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      if (typeParam === 'prayer' && !selectedCategories.includes('prayer_request')) {
        // Add prayer_request to selected categories if not already there
        setSelectedCategories(prev => {
          const newSelection = [...prev, 'prayer_request'];
          onChange(newSelection);
          return newSelection;
        });
      }
    }
  }, []);

  // Define categories in standard order
  const standardCategories: Category[] = [
    {
      id: 'family_updates',
      name: 'Family Updates',
      description: 'Regular updates about our family',
      icon: Users
    },
    {
      id: 'health_updates',
      name: 'Health Updates',
      description: 'Direct updates concerning family health issues',
      icon: HeartPulse
    },
    {
      id: 'prayer_request',
      name: 'Prayer Request',
      description: 'Received prayer requests from our family',
      icon: HandHeart
    },
    {
      id: 'business_ventures',
      name: 'Business Ventures',
      description: 'Get updates on our family business endeavors and upcoming launches',
      icon: Store,
      special: true
    }
  ];
  
  // Define categories in prayer mode order
  const prayerCategories: Category[] = [
    {
      id: 'prayer_request',
      name: 'Prayer Request',
      description: 'Received prayer requests from our family',
      icon: HandHeart
    },
    {
      id: 'family_updates',
      name: 'Family Updates',
      description: 'Regular updates about our family',
      icon: Users
    },
    {
      id: 'health_updates',
      name: 'Health Updates',
      description: 'Direct updates concerning family health issues',
      icon: HeartPulse
    },
    {
      id: 'business_ventures',
      name: 'Business Ventures',
      description: 'Get updates on our family business endeavors and upcoming launches',
      icon: Store,
      special: true
    }
  ];

  // Determine which categories to use based on prayer mode
  const categories = isPrayerMode ? prayerCategories : standardCategories;

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      // Call the onChange handler with the updated selection
      onChange(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-xl md:text-2xl font-semibold">Please choose what kind of notifications you would like to receive</h3>
        <p className="text-base text-muted-foreground">
          Please select one or more categories
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => {
          const isSelected = selectedCategories.includes(category.id);
          const isSpecial = category.special;
          const Icon = category.icon;
          
          return (
            <React.Fragment key={category.id}>
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  "w-full text-left py-4 px-6 rounded-lg border transition-all duration-200 flex items-center gap-4",
                  isSelected 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border hover:border-gray-300 hover:bg-gray-50",
                  isSpecial && !isSelected && "border-dashed"
                )}
              >
                {Icon && (
                  <span className={cn(
                    "flex-shrink-0 p-2 rounded-md", 
                    isSelected ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                  )}>
                    <Icon className="w-6 h-6" />
                  </span>
                )}
                <div className="flex-grow">
                  <div className="text-lg font-semibold">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-muted-foreground mt-1">{category.description}</div>
                  )}
                  {category.id === 'business_ventures' && (
                    <div className="text-sm text-primary/80 mt-2">
                      Due to health challenges, we’ve had to re-create our income sources. If you would like to help by sharing our upcoming endeavors or just want to know more, feel free to subscribe to these notifications too.
                    </div>
                  )}
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  isSelected 
                    ? "bg-primary border-primary" 
                    : "bg-white border-gray-300"
                )}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}