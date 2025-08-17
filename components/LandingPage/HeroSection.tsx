'use client';

import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-black dark:to-gray-800 pt-48 pb-20 px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <div className="flex-1 flex flex-col items-start justify-center text-left">
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Track your job search
            <br />
            <span className="text-blue-600 dark:text-blue-400">
              visually
            </span>{' '}
            and{' '}
            <span className="text-purple-600 dark:text-purple-400">
              effortlessly
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-xl">
            Organize applications, manage documents, and stay on top of your job
            hunt with a beautiful, intuitive dashboard.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition mb-4"
            aria-label="Sign up and start tracking your job search for free"
          >
            Get Started Free
          </Link>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            No credit card required
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="w-full aspect-[4/3] bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 rounded-2xl shadow-xl flex items-center justify-center">
            <Image
              priority
              width={1200}
              height={900}
              src="/images/JobsBoard.png"
              sizes="(min-width: 768px) 50vw, 90vw"
              alt="Screenshot of job tracker dashboard"
              className="w-full h-full object-contain rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
