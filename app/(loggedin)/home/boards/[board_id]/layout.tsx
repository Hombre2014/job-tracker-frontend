'use client';

import HomeNavbar from '@/components/HomePage/HomeNavbar/HomeNavbar';

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex h-full w-full flex-col">
      <div className="w-full flex-shrink-0">
        <HomeNavbar />
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
};

export default BoardLayout;
