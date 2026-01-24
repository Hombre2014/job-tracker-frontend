'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

import { ModeToggle } from '@/components/Themes/mode-toggle';
import HamburgerMenu from '@/components/Hamburger/HamburgerMenu';

const Navbar = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        helpDropdownRef.current &&
        !helpDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHelpOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full fixed inset-x-0 top-0 z-50 py-8 px-8 bg-amber-50/95 dark:bg-amber-700/95 backdrop-blur-md shadow-lg border-b border-amber-200/60 dark:border-amber-700/60">
      <div className="max-w-7xl mx-auto flex gap-x-2 justify-between">
        <Link href="/">
          <div className="flex items-center gap-x-1 w-44">
            <Image
              priority
              width="40"
              height="40"
              alt="JobTracker logo"
              src="/images/logo.png"
              className="cursor-pointer rounded-md"
            />
            <span className="text-2xl font-bold ml-4">JobTracker</span>
          </div>
        </Link>
        <div className="items-center justify-between gap-x-2 w-full hidden md:flex">
          <nav className="flex items-center gap-x-2">
            <ul className="flex gap-x-2">
              <li className="font-semibold p-2 rounded-md hover:bg-gray-300 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="#applications">Applications </Link>
              </li>
              <li className="font-semibold p-2 rounded-md hover:bg-gray-300 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="#documents">Documents</Link>
              </li>
              <li className="font-semibold p-2 rounded-md hover:bg-gray-300 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="#contacts">Contacts</Link>
              </li>
            </ul>
          </nav>
          <nav className="flex items-center gap-x-2">
            <ul className="flex gap-x-2">
              <li className="font-semibold p-2 rounded-md hover:bg-gray-300 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="/login">Log in</Link>
              </li>
              <li className="font-semibold p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 delay-150">
                <Link href="/signup">Sign up</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-x-1">
          {/* Help Dropdown */}
          <div className="relative hidden md:block" ref={helpDropdownRef}>
            <button
              type="button"
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="font-semibold p-2 mr-1 rounded-md hover:bg-gray-300 transition duration-300 delay-150 dark:hover:bg-slate-800 flex items-center gap-1"
            >
              Help
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`w-4 h-4 transition-transform ${isHelpOpen ? 'rotate-180' : ''}`}
              >
                <path
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isHelpOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-slate-700">
                <Link
                  href="/about"
                  onClick={() => setIsHelpOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-150"
                >
                  About
                </Link>
                <Link
                  href="/contact-us"
                  onClick={() => setIsHelpOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-150"
                >
                  Contact Us
                </Link>
                <Link
                  href="/how-to"
                  onClick={() => setIsHelpOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-150"
                >
                  How to?
                </Link>
              </div>
            )}
          </div>
          <ModeToggle />
          <div className="flex md:hidden ml-2">
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
