import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const SideBarMenuItem = ({ linkName, icon }: MenuItemProps) => {
  const pathname = usePathname();

  return (
    <Link
      className={cn(
        'flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 pl-2 mr-2 rounded-md dark:text-white',
        pathname === `/home/${linkName.toLowerCase()}`
          ? 'border border-blue-500 bg-blue-300/30 dark:bg-blue-600/40 hover:bg-blue-300/30 dark:hover:bg-blue-600/40'
          : '',
      )}
      href={`/home/${linkName.toLowerCase()}`}
    >
      <div
        className={cn(
          'h-5 w-5 flex items-center dark:text-white text-[20px]',
          pathname === `/home/${linkName.toLowerCase()}`
            ? 'text-blue-500 dark:text-blue-400'
            : '',
        )}
      >
        {icon}
      </div>
      <p>{linkName}</p>
    </Link>
  );
};

export default SideBarMenuItem;
