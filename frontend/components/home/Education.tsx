import Image from "next/image";

const Education = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <Image
            src="/media/images/education.svg"
            alt="Education"
            width={500}
            height={400}
            sizes="(max-width: 768px) 100vw, 448px"
            className="w-full max-w-md"
          />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
            Free and open market education
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline mb-8"
          >
            Varsity <span aria-hidden>→</span>
          </a>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            TradingQ&amp;A, the most active trading and investment community in
            India for all your market related queries.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
          >
            TradingQ&amp;A <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Education;
