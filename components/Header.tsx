
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
            <svg
                className="w-8 h-8 text-brand-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
            </svg>
            <span className="text-xl font-bold ml-2 text-gray-800">Visionary You</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
