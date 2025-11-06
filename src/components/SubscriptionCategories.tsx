import React, { useState } from 'react';
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
}

export default function SubscriptionCategories({ onChange, defaultSelected = ['family_updates'] }: SubscriptionCategoriesProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(defaultSelected);

  const categories: Category[] = [
    {
      id: 'family_updates',
      name: 'Family Updates',
      description: 'Regular updates about our family',
      icon: Users
    },
    {
      id: 'health_updates',
      name: 'Health Updates',
      description: 'Direct updates concerning Salicia\'s health',
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
        <h3 className="text-lg font-medium">Please choose what kind of notifications you would like to receive</h3>
        <p className="text-sm text-muted-foreground">
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
                  "w-full text-left py-3 px-4 rounded-lg border transition-all duration-200 flex items-center gap-3",
                  isSelected 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border hover:border-gray-300 hover:bg-gray-50",
                  isSpecial && !isSelected && "border-dashed"
                )}
              >
                {Icon && (
                  <span className={cn(
                    "flex-shrink-0 p-1.5 rounded-md", 
                    isSelected ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                  )}>
                    <Icon className="w-4 h-4" />
                  </span>
                )}
                <div className="flex-grow">
                  <div className="font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-xs text-muted-foreground mt-0.5">{category.description}</div>
                  )}
                  {category.id === 'business_ventures' && (
                    <div className="text-xs text-primary/80 mt-2">
                      Due to Salicia's health we have had to completely re-create our income sources. Being a part of these type  notifications is a way to help share if you would like to do so.
                    </div>
                  )}
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0",
                  isSelected 
                    ? "bg-primary border-primary" 
                    : "bg-white border-gray-300"
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}