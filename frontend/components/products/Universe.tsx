import Image from "next/image";

const Universe = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-20 text-center">
      <h1 className="text-4xl font-bold mb-4">The TradeCraft Universe</h1>

      <p className="text-gray-600 mb-12">
        Extend your trading and investment experience even further with our
        partner platforms
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Image
              src="/media/images/smallcaseLogo.png"
              alt="Smallcase"
              width={120}
              height={48}
              sizes="120px"
              className="h-12 mb-3"
            />
            <p className="text-sm text-gray-500">
              Thematic investment platform
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <button className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition">
          Signup Now
        </button>
      </div>
    </section>
  );
};

export default Universe;
