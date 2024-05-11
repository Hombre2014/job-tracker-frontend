'use client';

import Link from 'next/link';
import { PiBriefcaseLight } from 'react-icons/pi';
import {
  RiSearchLine,
  RiContactsLine,
  RiFolder2Line,
  RiShareLine,
} from 'react-icons/ri';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { ComboBox } from './ComboBox';

const HomeNavbar = () => {
  return (
    <nav className="flex justify-between items-center w-full pt-2 border-b border-slate-200 pb-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 items-center mx-2">
          <ComboBox />
        </div>
        <div className="flex items-center relative">
          <RiSearchLine className="absolute left-1" />
          <div className="w-40">
            <input
              type="text"
              placeholder="Filter"
              className="rounded-md border border-slate-500 pl-6 w-20 h-9 border-dashed transition-all duration-300 ease-in-out focus:w-40 focus:pl-8 focus:outline-none focus:border-blue-600 focus:border-solid"
            />
          </div>
        </div>
      </div>
      <ul className="flex gap-4">
        <li>
          <Link
            href="/board"
            className="flex items-center cursor-pointer p-1 hover:rounded-md hover:border hover:border-slate-300 transition duration-300 delay-150 border-transparent border rounded-md"
          >
            <PiBriefcaseLight />
            <span className="ml-2">Board</span>
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            href="/board"
            className="flex items-center cursor-pointer p-1 hover:rounded-md hover:border hover:border-slate-300 transition duration-300 delay-150 border-transparent border rounded-md"
          >
            <RiContactsLine />
            <span className="ml-2">Contacts</span>
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            href="/board"
            className="flex items-center cursor-pointer p-1 hover:rounded-md hover:border hover:border-slate-300 transition duration-300 delay-150 border-transparent border rounded-md"
          >
            <RiFolder2Line />
            <span className="ml-2">Documents</span>
          </Link>
        </li>
      </ul>
      <div className="flex gap-4 mr-4 items-center">
        <div className="flex items-center border-slate-300 border rounded-md px-2 py-1 cursor-pointer">
          <RiShareLine />
          <span className="ml-2">Share</span>
        </div>
        <div>
          <NavigationMenu className="mr-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-blue-500">
                  + Create
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-blue-500 p-2">
                  <NavigationMenuLink className="flex items-center py-2 px-4 mt-1 cursor-pointer hover:bg-blue-400 rounded-md">
                    <PiBriefcaseLight />
                    <span className="ml-2">Job</span>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="flex items-center py-2 px-4 cursor-pointer hover:bg-blue-400 rounded-md mb-1">
                    <RiContactsLine />
                    <span className="ml-2">Contact</span>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
