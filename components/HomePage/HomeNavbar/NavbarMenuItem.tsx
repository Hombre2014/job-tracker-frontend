import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const NavbarMenuItem = ({ linkName, icon }: MenuItemProps) => {
  const { board_id } = useParams();
  const pathname = usePathname();

  return (
    <Link
      href={`/home/boards/${board_id}/${linkName.toLowerCase()}`}
      className={cn(
        'flex items-center cursor-pointer p-1 hover:rounded-md hover:border hover:border-slate-300 transition duration-300 delay-150 border-transparent border rounded-md',
        pathname === `/home/boards/${board_id}/${linkName.toLowerCase()}`
          ? 'border border-slate-400 rounded-md p-1'
          : ''
      )}
    >
      {icon}
      <span className="ml-2">{linkName}</span>
    </Link>
  );
};

export default NavbarMenuItem;
