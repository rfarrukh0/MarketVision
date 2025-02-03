// src/components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="MarketVision Logo" 
                width={60} 
                height={60} 
              />
              <span className="ml-2 text-2xl font-extrabold text-blue-600">
                MarketVision
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
