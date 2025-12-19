import Link from "next/link";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-lg font-medium text-gray-700">Support Portal</h4>
        <Link href="#" className="text-blue-600 font-medium hover:underline">
          Track Tickets
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-4">
            Search for an answer or browse help topics to create a ticket
          </h1>

          <input
            type="text"
            placeholder="Eg. how do I activate F&O"
            className="w-full border border-gray-300 rounded px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="#" className="text-blue-600 hover:underline">
              Track account opening
            </Link>
            <Link href="#" className="text-blue-600 hover:underline">
              Track segment activation
            </Link>
            <Link href="#" className="text-blue-600 hover:underline">
              Intraday margins
            </Link>
            <Link href="#" className="text-blue-600 hover:underline">
              Kite user manual
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-4">Featured</h1>

          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <Link href="#" className="text-blue-600 hover:underline">
                Current Takeovers and Delisting – January 2024
              </Link>
            </li>
            <li>
              <Link href="#" className="text-blue-600 hover:underline">
                Latest Intraday leverages – MIS & CO
              </Link>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Hero;
