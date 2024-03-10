'use client';

import Image from 'next/image';
import Link from 'next/link';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="h-full overflow-auto flex">
        <div className="w-48 h-full border-r-2 border-slate-200">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width="40"
              height="40"
              className="cursor-pointer rounded-md pt-4 ml-4"
            />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center h-full w-full">
          {children}
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
