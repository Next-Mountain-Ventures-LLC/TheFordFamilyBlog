import React, { useState } from 'react';

// Define the FreeStuffGallery component
export default function FreeStuffGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Image paths for the gallery
  // We'll need to copy these images to assets directory
  const images = [
    '/src/assets/img_2718_nw_afe5f144.jpeg',
    '/src/assets/img_2719_nw_d0625901.jpeg',
    '/src/assets/img_2720_nw_d54e608c.jpeg',
    '/src/assets/img_2721_nw_5ccf2e8f.jpeg',
    '/src/assets/img_2722_nw_1b2522f8.jpeg',
    '/src/assets/img_2723_nw_db7f2498.jpeg',
    '/src/assets/img_2724_nw_43210e19.jpeg',
    '/src/assets/img_2725_nw_73296f6e.jpeg',
    '/src/assets/img_2726_nw_d9d3ce2e.jpeg',
    '/src/assets/img_2727_nw_a3f54761.jpeg',
    '/src/assets/img_2728_nw_d2152b8e.jpeg',
    '/src/assets/img_2729_nw_1b124e30.jpeg',
    '/src/assets/img_2730_nw_835622b9.jpeg',
    '/src/assets/img_2731_nw_eb3266e1.jpeg',
    '/src/assets/img_2732_nw_a4015955.jpeg',
    '/src/assets/img_2733_nw_b09dd68e.jpeg',
    '/src/assets/img_2734_nw_55c0a1c1.jpeg',
    '/src/assets/img_2735_nw_53c3232b.jpeg',
    '/src/assets/img_2736_nw_4758c97b.jpeg',
    '/src/assets/img_2737_nw_d7487bda.jpeg',
    '/src/assets/img_2738_nw_746aaedf.jpeg',
    '/src/assets/img_2740_nw_849d0e17.jpeg',
  ];

  return (
    <div className="mb-6 -mt-2 -mx-2 overflow-hidden">
      <div className="relative">
        {/* Main gallery */}
        <div className="scrapbook-photo w-full" style={{ "--rotate": "0deg" } as React.CSSProperties}>
          <div className="scrapbook-tape"></div>
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-4 snap-x snap-mandatory w-full">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className="snap-start shrink-0 w-[280px] h-[200px] rounded overflow-hidden border-4 border-white shadow-md"
                >
                  <img 
                    src={image} 
                    alt={`Free stuff item ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <button 
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10"
          onClick={() => {
            const scrollContainer = document.querySelector('.snap-x');
            if (scrollContainer) {
              scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
            }
          }}
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
        </button>
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10"
          onClick={() => {
            const scrollContainer = document.querySelector('.snap-x');
            if (scrollContainer) {
              scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
            }
          }}
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </button>
      </div>

      {/* Caption */}
      <div className="text-center mt-4 italic text-sm text-gray-600">
        Browse through our collection of free resources and materials
      </div>
    </div>
  );
}