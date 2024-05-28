import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const SideBarMenuItem = ({ linkName, icon }: MenuItemProps) => {
  const pathname = usePathname();

  return (
    <Link
      className={cn(
        'flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-100 pl-2 mr-2 rounded-md',
        pathname === `/home/${linkName.toLowerCase()}`
          ? 'border border-blue-500 bg-blue-300/30 hover:bg-blue-300/30'
          : ''
      )}
      href={`/home/${linkName.toLowerCase()}`}
    >
      <div
        className={cn(
          'h-5 w-5 flex items-center',
          pathname === `/home/${linkName.toLowerCase()}` ? 'text-blue-500' : ''
        )}
      >
        {icon}
      </div>
      <p>{linkName}</p>
    </Link>
  );
};

export default SideBarMenuItem;
