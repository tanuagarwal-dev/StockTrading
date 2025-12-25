const topics = [
  {
    title: "Account Opening",
    links: [
      "Online Account Opening",
      "Offline Account Opening",
      "Company, Partnership and HUF Account Opening",
      "NRI Account Opening",
      "Charges at TradeCraft",
      "TradeCraft IDFC FIRST Bank 3-in-1 Account",
      "Getting Started",
    ],
  },
  {
    title: "Your TradeCraft Account",
    links: [
      "Login Credentials",
      "Account Modification",
      "CMR & DP ID",
      "Nomination",
      "Transfer & Conversion of Shares",
    ],
  },
  {
    title: "Trading & Markets",
    links: [
      "Kite",
      "Margins",
      "Order Types",
      "Corporate Actions",
      "Kite Features",
    ],
  },
  {
    title: "Funds",
    links: [
      "Adding Funds",
      "Withdrawing Funds",
      "Bank Accounts",
      "Segment Activation",
    ],
  },
  {
    title: "Console",
    links: ["Portfolio", "Reports", "Statements", "Tax P&L"],
  },
  {
    title: "Coin",
    links: ["Mutual Funds", "ELSS", "SIP", "Taxation"],
  },
];

const CreateTicket = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold mb-10">
        To create a ticket, select a relevant topic
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {topics.map((topic, idx) => (
          <div key={idx}>
            <h4 className="flex items-center gap-2 text-lg font-medium mb-4">
              <span className="text-blue-600 text-xl">+</span>
              {topic.title}
            </h4>

            <ul className="space-y-2">
              {topic.links.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CreateTicket;
