import React, { useState } from 'react'
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex md:hidden items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-6 w-6">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
          <span className="sr-only">Toggle menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur p-6">
        <div className="font-bold text-xl mb-6 mt-4 text-primary-foreground">The Ford Family<span className="text-accent-foreground">.life</span></div>
        <nav className="flex flex-col gap-6">
          <a
            href="/"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="/salicia"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Salicia
          </a>
          <a
            href="/joshua"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Joshua
          </a>
          <a
            href="/jackson"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Jackson
          </a>
          <a
            href="/finley"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Finley
          </a>
          <a
            href="https://www.youtube.com/@TheFordFamilyLife"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-fit"
            onClick={() => setIsOpen(false)}
          >
            <span className="mr-2">YouTube</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}