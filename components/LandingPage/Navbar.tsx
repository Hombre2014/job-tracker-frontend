'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fragment } from 'react';

import { ModeToggle } from '@/components/Themes/mode-toggle';
import HamburgerMenu from '@/components/Hamburger/HamburgerMenu';

const Navbar = () => {
  return (
    <Fragment>
      <header className="w-full fixed inset-x-0 top-0 z-50 py-8 px-8 bg-amber-50/95 dark:bg-amber-700/95 backdrop-blur-md shadow-lg border-b border-amber-200/60 dark:border-amber-700/60">
        <div className="max-w-7xl mx-auto flex gap-x-6 justify-between">
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
            <nav className="flex items-center gap-x-2 mr-2">
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
            <ModeToggle />
            <div className="flex md:hidden ml-2">
              <HamburgerMenu />
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default Navbar;
