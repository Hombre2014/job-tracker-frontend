import Link from 'next/link';
import Image from 'next/image';
import { FaFileContract, FaUserShield, FaGithub } from 'react-icons/fa';

const Footer = (): JSX.Element => {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="w-full bg-gray-900 text-gray-100 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image
            width={32}
            height={32}
            src="/images/logo.png"
            alt="Job Tracker logo"
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
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center cursor-pointer text-gray-400 text-sm hover:text-gray-200 transition">
              <FaUserShield size={18} />
              <a href="/helper-privacy">JT Helper Privacy Policy</a>
            </div>
            <div className="flex gap-2 items-center cursor-pointer text-gray-400 text-sm hover:text-gray-200 transition">
              <a
                target="_blank"
                aria-label="GitHub"
                rel="noopener noreferrer"
                className="hover:text-gray-200 flex gap-2"
                href="https://github.com/Hombre2014/job-tracker-extension"
              >
                <FaGithub size={18} />
                <span>Give JT Helper a star</span>
              </a>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center text-gray-400 text-sm hover:text-gray-200 transition">
                <FaFileContract size={18} />
                <a href="/terms">Terms of Service</a>
              </div>
              <div className="flex gap-2 items-center text-gray-400 text-sm hover:text-gray-200 transition">
                <FaUserShield size={18} />
                <a href="/privacy">Privacy Policy</a>
              </div>
              <div className="flex gap-2 items-center cursor-pointer text-gray-400 text-sm hover:text-gray-200 transition">
                <a
                  target="_blank"
                  aria-label="GitHub"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 flex gap-2"
                  href="https://github.com/Hombre2014/job-tracker-frontend"
                >
                  <FaGithub size={18} />
                  <span>Give JT a star</span>
                </a>
              </div>
            </div>
          </div>
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
