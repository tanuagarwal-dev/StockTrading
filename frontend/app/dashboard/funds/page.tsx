import Menu from "@/components/dashboard/Menu";
import Link from "next/link";

export default function Funds() {
  return (
    <>
      <Menu />
      <section className="space-y-10 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-md border p-4 bg-white">
          <p className="text-sm text-gray-700">
            Instant, zero-cost fund transfers with UPI
          </p>

          <div className="flex gap-3">
            <Link
              href="#"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
            >
              Add funds
            </Link>

            <Link
              href="#"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Withdraw
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-md border bg-white p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-700">Equity</p>

            <div className="space-y-3 text-sm">
              <Row label="Available margin" value="4,043.10" highlight />
              <Row label="Used margin" value="3,757.30" />
              <Row label="Available cash" value="4,043.10" />

              <hr />

              <Row label="Opening balance" value="4,043.10" />
              <Row label="Live balance" value="3,736.40" />
              <Row label="Payin" value="4,064.00" />
              <Row label="SPAN" value="0.00" />
              <Row label="Delivery margin" value="0.00" />
              <Row label="Exposure" value="0.00" />
              <Row label="Options premium" value="0.00" />

              <hr />

              <Row label="Collateral (Liquid funds)" value="0.00" />
              <Row label="Collateral (Equity)" value="0.00" />
              <Row label="Total Collateral" value="0.00" />
            </div>
          </div>

          <div className="rounded-md border bg-white p-5 flex flex-col justify-between">
            <p className="text-sm text-gray-600">
              You don&apos;t have a commodity account
            </p>

            <Link
              href="/signup"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition w-fit"
            >
              Open Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* Reusable row */
function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center p-2">
      <p className="text-gray-600">{label}</p>
      <p
        className={`font-medium ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
