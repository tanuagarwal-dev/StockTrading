import Image from "next/image";

const Awards = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <Image
            src="/media/images/largestBroker.svg"
            alt="Largest stock broker"
            width={500}
            height={400}
            sizes="(max-width: 768px) 100vw, 448px"
            className="w-full max-w-md mx-auto"
          />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
            Largest stock broker in India
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8">
            2+ million Zerodha clients contribute to over 15% of all retail
            order volumes in India daily by trading and investing in:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-gray-600 dark:text-gray-300">
            <ul className="space-y-2 list-disc list-inside">
              <li>Futures and Options</li>
              <li>Commodity derivatives</li>
              <li>Currency derivatives</li>
            </ul>

            <ul className="space-y-2 list-disc list-inside">
              <li>Stocks & IPOs</li>
              <li>Direct mutual funds</li>
              <li>Bonds and Govt. Securities</li>
            </ul>
          </div>

          <Image
            src="/media/images/pressLogos.png"
            alt="Press coverage"
            width={600}
            height={100}
            sizes="(max-width: 640px) 100vw, 512px"
            className="w-full max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Awards;
