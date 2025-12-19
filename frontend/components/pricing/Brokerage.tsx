const Brokerage = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="md:col-span-2">
          <a
            href="#"
            className="inline-block mb-4 text-lg font-medium text-blue-600 hover:underline"
          >
            Brokerage calculator
          </a>

          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed list-disc list-inside">
            <li>
              Call & Trade and RMS auto-squareoff: Additional charges of ₹50 +
              GST per order.
            </li>
            <li>Digital contract notes will be sent via e-mail.</li>
            <li>
              Physical copies of contract notes, if required, shall be charged
              ₹20 per contract note. Courier charges apply.
            </li>
            <li>
              For NRI account (non-PIS), 0.5% or ₹100 per executed order for
              equity (whichever is lower).
            </li>
            <li>
              For NRI account (PIS), 0.5% or ₹200 per executed order for equity
              (whichever is lower).
            </li>
            <li>
              If the account is in debit balance, any order placed will be
              charged ₹40 per executed order instead of ₹20 per executed order.
            </li>
          </ul>
        </div>

        <div className="flex items-start justify-center md:justify-start">
          <a
            href="#"
            className="text-lg font-medium text-blue-600 hover:underline"
          >
            List of charges
          </a>
        </div>
      </div>
    </section>
  );
};

export default Brokerage;
