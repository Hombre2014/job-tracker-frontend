'use client';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto w-full text-slate-700 dark:text-slate-300">
      {children}
    </div>
  );
};

export default HomeLayout;
