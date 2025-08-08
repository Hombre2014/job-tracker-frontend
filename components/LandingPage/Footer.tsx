import Image from 'next/image';
import Link from 'next/link';

const Footer = (): JSX.Element => {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="w-full bg-gray-900 text-gray-100 py-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-8">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Job Tracker logo"
            width={32}
            height={32}
            className="rounded bg-gray-700"
          />
          <Link
            href="/"
            aria-label="Home"
            className="font-bold text-lg tracking-wide"
          >
            Job Tracker
          </Link>
        </div>
        <div className="flex text-gray-400">
          <a
            target="_blank"
            aria-label="GitHub"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
            href="https://github.com/Hombre2014/job-tracker-frontend"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
        </div>
        <div className="text-xs text-gray-400">
          &copy; <span suppressHydrationWarning>{year}</span> Job Tracker. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
