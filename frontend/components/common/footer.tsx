import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <Image
              src="/media/images/logo.svg"
              alt="TradeCraft"
              width={128}
              height={32}
              sizes="128px"
              className="w-32 mb-4"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2010 – 2024, Not TradeCraft Broking Ltd. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Referral programme
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  TradeCraft.tech
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Press & media
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  TradeCraft cares (CSR)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Support portal
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Z-Connect blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  List of charges
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Downloads & resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/signup"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Open an account
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Fund transfer
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  60 day challenge
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-xs text-gray-500 dark:text-gray-400 space-y-4 leading-relaxed">
          <p>
            TradeCraft Broking Ltd.: Member of NSE & BSE – SEBI Registration
            no.: INZ000031633 CDSL: Depository services through TradeCraft
            Securities Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015
            Commodity Trading through TradeCraft Commodities Pvt. Ltd. MCX:
            46025 – SEBI Registration no.: INZ000038238
          </p>

          <p>
            Procedure to file a complaint on SEBI SCORES: Register on SCORES
            portal. Mandatory details for filing complaints on SCORES: Name,
            PAN, Address, Mobile Number, E-mail ID.
          </p>

          <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p>

          <p>
            Prevent unauthorised transactions in your account. Update your
            mobile numbers/email IDs with your stock brokers. Receive
            information of your transactions directly from Exchange on your
            mobile/email at the end of the day.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
