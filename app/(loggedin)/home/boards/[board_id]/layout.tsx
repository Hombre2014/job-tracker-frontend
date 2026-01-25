'use client';

import HomeNavbar from '@/components/HomePage/HomeNavbar/HomeNavbar';

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col">
      <section className="flex w-full flex-col h-full">
        <div className="flex flex-col w-full h-full">
          <div className="w-full flex-shrink-0">
            <HomeNavbar />
          </div>
          <div className="flex-1 min-h-0">{children}</div>
        </div>
      </section>
    </div>
  );
};

export default BoardLayout;
