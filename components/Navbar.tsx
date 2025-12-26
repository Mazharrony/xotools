'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/config';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links
    if (href.startsWith('#')) {
      e.preventDefault();
      
      // Check if we're on a different page (contact page)
      if (pathname === '/contact') {
        // Navigate to home page with hash
        router.push(`/${href}`);
        // Scroll will be handled by useEffect in BarcodeGenerator component
      } else {
        // We're on the home page, scroll to element
        const element = document.querySelector(href);
        if (element) {
          const navHeight = 80; // Approximate navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-gray-900/5">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#generator" 
            onClick={(e) => handleNavClick(e, '#generator')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/barcoderapp-logo.svg" 
              alt="Barcode Generator Logo" 
              className="h-16 w-auto"
            />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#generator"
              onClick={(e) => handleNavClick(e, '#generator')}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group cursor-pointer"
            >
              Generator
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#batch"
              onClick={(e) => handleNavClick(e, '#batch')}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group cursor-pointer"
            >
              Batch
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#services"
              onClick={(e) => handleNavClick(e, '#services')}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group cursor-pointer"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="/contact"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href={siteConfig.behanceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Behance"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 7.5V16.5h5.4c1.5 0 2.7-.6 2.7-2.4 0-1.8-1.2-2.4-2.7-2.4H0zm16.5 0V9h4.2v1.5h-4.2v1.8h4.2v1.5h-4.2V16.5h5.4c1.5 0 2.7-.6 2.7-2.4 0-1.8-1.2-2.4-2.7-2.4h-5.4zm-11.4 3.3H5.4c.9 0 1.5.3 1.5 1.2 0 .9-.6 1.2-1.5 1.2H5.1v-2.4zm6.3-6.3H0v1.5h5.4c1.5 0 2.7-.6 2.7-2.4 0-1.8-1.2-2.4-2.7-2.4H0V0h7.5v1.5H5.4c.9 0 1.5.3 1.5 1.2 0 .9-.6 1.2-1.5 1.2H0v1.5h5.4c1.5 0 2.7-.6 2.7-2.4 0-1.8-1.2-2.4-2.7-2.4H0V0h7.5v4.5z"/>
              </svg>
              <span className="hidden lg:inline">Behance</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

          {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-fade-in">
            <a
              href="#generator"
              onClick={(e) => handleNavClick(e, '#generator')}
              className="block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              Generator
            </a>
            <a
              href="#batch"
              onClick={(e) => handleNavClick(e, '#batch')}
              className="block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              Batch
            </a>
            <a
              href="#services"
              onClick={(e) => handleNavClick(e, '#services')}
              className="block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              Services
            </a>
            <a
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Contact
            </a>
            <a
              href={siteConfig.behanceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 7.5V16.5h5.4c1.5 0 2.7-.6 2.7-2.4 0-1.8-1.2-2.4-2.7-2.4H0zm16.5 0V9h4.2v1.5h-4.2v1.8h4.2v1.5h-4.2V16.5h5.4c1.5 0 2.7-.6 2.7-2.4 0-1.8-1.2-2.4-2.7-2.4h-5.4zm-11.4 3.3H5.4c.9 0 1.5.3 1.5 1.2 0 .9-.6 1.2-1.5 1.2H5.1v-2.4zm6.3-6.3H0v1.5h5.4c1.5 0 2.7-.6 2.7-2.4 0-1.8-1.2-2.4-2.7-2.4H0V0h7.5v1.5H5.4c.9 0 1.5.3 1.5 1.2 0 .9-.6 1.2-1.5 1.2H0v1.5h5.4c1.5 0 2.7-.6 2.7-2.4 0-1.8-1.2-2.4-2.7-2.4H0V0h7.5v4.5z"/>
              </svg>
              Behance
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

