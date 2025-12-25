"use client";
import Menu from "@/components/dashboard/Menu";

const Apps = () => {
  return (
    <>
      <section className="p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trading Apps
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powerful trading tools and applications
          </p>
        </div>
      </section>
      <div className="p-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-25 animate-pulse"></div>
              <svg
                className="relative w-16 h-16 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m0 0h6M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              We're building amazing trading apps and tools for you. Stay tuned!
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
            <p>✨ Advanced analytics</p>
            <p>📊 Custom strategies</p>
            <p>🤖 AI-powered insights</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Apps;
