'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

const Navbar = () => {
  return (
    <Fragment>
      <div className="bg-[#e7eaf0] w-full h-8 border z-50 fixed" />
      <header className="flex gap-x-8 w-5/6 mx-auto fixed top-8 left-0 right-0 z-50 pb-8 bg-[#e7eaf0]">
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
        <div className="flex items-center justify-between gap-x-8 w-full bg-[#e7eaf0]">
          <nav className="flex items-center gap-x-2">
            <ul className="flex gap-x-4">
              <li className="font-semibold p-2 rounded-md hover:bg-slate-300 transition duration-300 delay-150">
                <Link href="#applications">Applications </Link>
              </li>
              <li className="font-semibold p-2 rounded-md hover:bg-slate-300 transition duration-300 delay-150">
                <Link href="#documents">Documents</Link>
              </li>
              <li className="font-semibold p-2 rounded-md hover:bg-slate-300 transition duration-300 delay-150">
                <Link href="#contacts">Contacts</Link>
              </li>
            </ul>
          </nav>
          <nav>
            <ul className="flex gap-x-4">
              <li className="font-semibold p-2 rounded-md hover:bg-slate-300 transition duration-300 delay-150">
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
