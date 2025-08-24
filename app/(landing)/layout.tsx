'use client';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full min-h-screen">
      <div className="mx-auto h-full w-full">{children}</div>
    </main>
  );
};

export default LandingLayout;
