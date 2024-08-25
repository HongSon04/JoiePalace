"use client";

import React from "react";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-white mb-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm0-5a1 1 0 011 1v1a1 1 0 11-2 0V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-white text-lg">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
