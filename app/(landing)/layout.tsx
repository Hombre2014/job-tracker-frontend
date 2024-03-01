'use client';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-[#e7eaf0] overflow-auto">
      <div className="mx-auto h-full w-full">{children}</div>
    </main>
  );
};

export default LandingLayout;
