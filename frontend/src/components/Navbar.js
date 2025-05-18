import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [username, setUsername] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.username);
      } catch (err) {
        console.error("Failed to decode token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUsername(null);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and name */}
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

          {/* Right: Auth controls */}
          <div className="flex items-center space-x-4">
            {username ? (
              <div className="relative">
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="cursor-pointer flex items-center space-x-2"
                >
                  <Image 
                    src="/pfp.jpg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-sm text-gray-700">
                    Signed in as <strong>{username}</strong>
                  </span>
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-50">
                    <Link 
                      href="/my-prompts"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Prompts
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
