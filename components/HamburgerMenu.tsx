'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import HamburgerIcon from './hamburger-icon';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        type="button"
        aria-label="Menu"
        onClick={handleClick}
        className="flex flex-col justify-center items-center"
      >
        <HamburgerIcon />
      </button>
      {isOpen && (
        // <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <Menu left width={'100%'} className="bg-gray-800 text-white">
          <Link href="#applications">Applications </Link>
          <Link href="#documents">Documents</Link>
          <Link href="#contacts">Contacts</Link>
          <Link href="">Log in</Link>
          <Link href="">Sign up for free</Link>
        </Menu>
        // </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
