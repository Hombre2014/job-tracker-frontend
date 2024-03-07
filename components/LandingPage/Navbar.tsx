'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import HamburgerMenu from '@/components/HamburgerMenu';

const Navbar = () => {
  return (
    <Fragment>
      <div className="w-full h-8 z-50 fixed bg-white dark:bg-black" />
      <header className="flex gap-x-8 w-5/6 mx-auto fixed top-8 left-0 right-0 z-50 pb-8 bg-white dark:bg-black">
        <HamburgerMenu />
        <Link href="/">
          <div className="flex items-center gap-x-2 w-64">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width="40"
              height="40"
              className="cursor-pointer rounded-md"
            />
            <h1 className="text-2xl font-bold">JobTracker</h1>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-x-8 w-full">
          <nav className="flex items-center gap-x-2">
            <ul className="flex gap-x-4">
              <li className="font-semibold p-2 rounded-md hover:bg-slate-100 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="#applications">Applications </Link>
              </li>
              <li className="font-semibold p-2 rounded-md hover:bg-slate-100 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="#documents">Documents</Link>
              </li>
              <li className="font-semibold p-2 rounded-md hover:bg-slate-100 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="#contacts">Contacts</Link>
              </li>
            </ul>
          </nav>
          <nav className="flex items-center gap-x-2">
            <ModeToggle />
            <ul className="flex gap-x-4">
              <li className="font-semibold p-2 rounded-md hover:bg-slate-100 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="">Log in</Link>
              </li>
              <li className="font-semibold p-2 bg-blue-500 text-white rounded-md">
                <Link href="">Sign up for free</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </Fragment>
  );
};

export default Navbar;
