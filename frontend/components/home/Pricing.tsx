import Link from "next/link";

const Pricing = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
            Unbeatable pricing
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
          >
            See pricing <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white dark:bg-gray-800">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              ₹0
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Free equity delivery and
              <br />
              direct mutual funds
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white dark:bg-gray-800">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              ₹20
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Intraday and F&amp;O
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
