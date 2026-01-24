'use client';

const LegalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="fixed inset-0 bg-white dark:bg-slate-900 -z-10" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-36 pb-36 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
};

export default LegalLayout;
