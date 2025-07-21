'use client';

const LegalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-36 pb-36 text-slate-700 dark:text-slate-300">
      {children}
    </div>
  );
};

export default LegalLayout;
