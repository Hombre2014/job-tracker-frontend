import HomeNavbar from '@/components/HomePage/HomeNavbar';

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      <section className="flex w-full">
        <div className="flex flex-col w-full">
          <div className="w-full">
            <HomeNavbar />
          </div>
          <div className="h-full">{children}</div>
        </div>
      </section>
    </div>
  );
};

export default BoardLayout;
