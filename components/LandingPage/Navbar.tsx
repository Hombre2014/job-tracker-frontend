'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import HamburgerMenu from '@/components/HamburgerMenu';

const Navbar = () => {
  return (
    <Fragment>
      <header className="md:flex gap-x-1 w-11/12 mx-auto fixed top-0 left-0 right-0 z-50 py-8 bg-white dark:bg-black justify-between flex xl:w-5/6 2xl:w-2/3">
        <Link href="/">
          <div className="flex items-center gap-x-1 w-44">
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
        <div className="items-center justify-between gap-x-2 w-full hidden md:flex">
          <nav className="flex items-center gap-x-2">
            <ul className="flex gap-x-2">
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
          <nav className="flex items-center gap-x-2 mr-2">
            <ul className="flex gap-x-2">
              <li className="font-semibold p-2 rounded-md hover:bg-slate-100 transition duration-300 delay-150 dark:hover:bg-slate-800">
                <Link href="">Log in</Link>
              </li>
              <li className="font-semibold p-2 bg-blue-500 text-white rounded-md">
                <Link href="">Sign up</Link>
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
      </header>
    </Fragment>
  );
};

export default Navbar;
