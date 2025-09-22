import React, { useState } from 'react';
import { buttonVariants } from './ui/button';

interface DigitalProduct {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  featured?: boolean;
}

interface DigitalProductsStoreProps {
  title: string;
  description?: string;
  products: DigitalProduct[];
}

export default function DigitalProductsStore({ title, description, products }: DigitalProductsStoreProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const featuredProduct = products.find(product => product.featured);
  const regularProducts = products.filter(product => !product.featured);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-display mb-3 text-primary-foreground">{title}</h2>
          {description && <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>

        {/* Featured Product */}
        {featuredProduct && (
          <div className="mb-12">
            <div className="scrapbook-paper bg-white/95 p-0 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-full min-h-[300px] overflow-hidden">
                  <img
                    src={featuredProduct.imageUrl}
                    alt={featuredProduct.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-secondary/80 text-secondary-foreground text-xs rounded-full uppercase font-bold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-display mb-3">{featuredProduct.title}</h3>
                    <p className="text-muted-foreground mb-4">{featuredProduct.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">{featuredProduct.price}</span>
                      <button className={buttonVariants({ variant: "default", size: "lg" })}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularProducts.map((product, index) => (
            <div key={index} className="scrapbook-paper bg-white/90 flex flex-col">
              <div className="mb-4 h-48 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-sm transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-bold font-display mb-2">{product.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-primary">{product.price}</span>
                  <button className={buttonVariants({ variant: "default", size: "sm" })}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}