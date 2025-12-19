export default function TopBar() {
  return (
    <header className=" border-b border-gray-200 dark:border-gray-700 dark:from-gray-800 dark:to-gray-700 px-3 lg:px-4 py-3">
      {/* Indices */}
      <div className="flex flex-col sm:flex-row gap-3 lg:gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg px-3 lg:px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-600 flex-1 sm:flex-none">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
            NIFTY 50
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              100.2
            </p>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400">
              ↑ +0.45%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg px-3 lg:px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-600 flex-1 sm:flex-none">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
            SENSEX
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              100.2
            </p>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400">
              ↑ +0.32%
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
