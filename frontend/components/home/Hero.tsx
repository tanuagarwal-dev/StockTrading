import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-center bg-white dark:bg-gray-900">
      <Image
        src="/media/images/homeHero.png"
        alt="Hero"
        width={1200}
        height={600}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        className="mx-auto mb-12 w-full max-w-4xl"
        priority
      />

      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        Invest in everything
      </h1>

      <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
        Online platform to invest in stocks, derivatives, mutual funds, and more
      </p>

      <Link
        href="/signup"
        className="inline-block px-8 py-3 text-lg font-medium text-white bg-blue-600 dark:bg-blue-500 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
      >
        Signup Now
      </Link>
    </section>
  );
};

export default Hero;
