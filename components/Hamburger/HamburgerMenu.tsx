'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { fallDown as Menu } from 'react-burger-menu';
import HamburgerIcon from './hamburger-icon';
import { FaTimes } from 'react-icons/fa';
import navbarLinks from '@/data/navbar-links';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50">
          <Menu
            isOpen={isOpen}
            right
            width={'100%'}
            className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
          >
            <div className="flex justify-end">
              <button
                title="Close"
                type="button"
                onClick={handleClick}
                className="p-4 ml-4 mt-4 text-black dark:text-white w-12 h-12 rounded-full hover:bg-slate-100 transition duration-300 delay-150 dark:hover:bg-slate-600"
              >
                <FaTimes />
              </button>
            </div>
            <ul>
              {navbarLinks.map((link) => (
                <li
                  key={link.title}
                  className="mx-4 w-content p-4 font-semibold rounded-md hover:bg-slate-100 transition duration-300 delay-150 dark:hover:bg-slate-600"
                >
                  <Link href={link.url} onClick={handleClick}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Menu>
        </div>
      )}
      <button
        type="button"
        aria-label="Menu"
        onClick={handleClick}
        className="flex flex-col justify-center items-center"
      >
        <HamburgerIcon />
      </button>
    </div>
  );
};

export default HamburgerMenu;
