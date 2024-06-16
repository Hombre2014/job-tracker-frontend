'use client';

import SearchBox from './SearchBox';
import { ComboBox } from './ComboBox';
import CreateMenu from './CreateMenu';
import menuItems from '@/data/menu-items';
import NavbarMenuItem from './NavbarMenuItem';
import { useAppSelector } from '@/redux/hooks';
import { returnMenuIcon } from '@/utils/ReturnIcons';

const HomeNavbar = () => {
  const { boards } = useAppSelector((state) => state.boards);
  return (
    <div className="flex justify-between items-center w-full pt-2 border-b border-slate-200 pb-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 items-center mx-2">
          <ComboBox items={boards} searchItem="Boards" initialString="" />
        </div>
        <SearchBox />
      </div>
      <nav>
        <ul className="flex gap-4">
          {menuItems.map((item) => (
            <li key={item.title} className="flex items-center">
              <NavbarMenuItem
                linkName={item.title}
                icon={returnMenuIcon(item.icon)!}
              />
            </li>
          ))}
        </ul>
      </nav>
      <CreateMenu />
    </div>
  );
};

export default HomeNavbar;
