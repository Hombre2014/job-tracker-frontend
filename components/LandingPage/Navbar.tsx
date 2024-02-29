import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="flex gap-x-8 w-5/6 mx-auto my-8">
      <div className="flex items-center gap-x-2 w-64">
        <Link href="./">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width="40"
            height="40"
            className="cursor-pointer rounded-md"
          />
        </Link>
        <h1 className="text-2xl font-bold">JobTracker</h1>
      </div>
      <div className="flex items-center justify-between gap-x-8 w-full">
        <nav className="flex items-center gap-x-2">
          <ul className="flex gap-x-4">
            <li className="font-semibold p-2 rounded-md hover:bg-slate-300 transition duration-300 delay-150">
              <Link href="#applications">Applications </Link>
            </li>
            <li className="font-semibold p-2 rounded-md hover:bg-slate-300 transition duration-300 delay-150">
              <Link href="#documents">Documents</Link>
            </li>
            <li className="font-semibold p-2 rounded-md hover:bg-slate-300 transition duration-300 delay-150">
              <Link href="#companies">Contacts</Link>
            </li>
          </ul>
        </nav>
        <nav>
          <ul className="flex gap-x-4">
            <li className="font-semibold p-2 rounded-md hover:bg-slate-300 transition duration-300 delay-150">
              <Link href="">Log in</Link>
            </li>
            <li className="font-semibold p-2 bg-blue-500 text-white rounded-md">
              <Link href="">Sign up for free</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
