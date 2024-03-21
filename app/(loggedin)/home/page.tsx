'use client';

import BoardColumn from '@/components/HomePage/BoardColumn';
import HomeNavbar from '@/components/HomePage/HomeNavbar';
import Sidebar from '@/components/HomePage/Sidebar';

const HomePage = () => {
  return (
    <div className="flex h-full">
      <aside className="w-52">
        <Sidebar />
      </aside>
      <section className="flex w-5/6">
        <div className="flex flex-col">
          <nav>
            <HomeNavbar />
          </nav>
          <main>
            <BoardColumn />
          </main>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
