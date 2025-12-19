"use client";

import Menu from "@/components/dashboard/Menu";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import FundsModal from "@/components/dashboard/FundsModal";

export default function Funds() {
  const { user } = useUser();
  const [modal, setModal] = useState<"ADD" | "WITHDRAW" | null>(null);

  if (!user) return null;

  const available = user.funds.available;
  const used = user.funds.used;
  const total = available + used; // opening & live (simulator)

  return (
    <>
      <Menu />

      {modal && <FundsModal type={modal} onClose={() => setModal(null)} />}

      <section className="space-y-10 p-4">
        <div className="flex justify-between items-center border p-4 bg-white rounded">
          <p className="text-sm text-gray-700">
            Instant, zero-cost fund transfers (mock)
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setModal("ADD")}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Add funds
            </button>
            <button
              onClick={() => setModal("WITHDRAW")}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="rounded-md border bg-white p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-700">Equity</p>

          <Row
            label="Available margin"
            value={available.toFixed(2)}
            highlight
          />
          <Row label="Used margin" value={used.toFixed(2)} />
          <Row label="Available cash" value={available.toFixed(2)} />

          <hr />

          <Row label="Opening balance" value={total.toFixed(2)} />
          <Row label="Live balance" value={total.toFixed(2)} />
          <Row label="Payin" value="—" />
          <Row label="SPAN" value="0.00" />
          <Row label="Delivery margin" value={used.toFixed(2)} />
          <Row label="Exposure" value={used.toFixed(2)} />
          <Row label="Options premium" value="0.00" />

          <hr />

          <Row label="Total collateral" value="0.00" />
        </div>
      </section>
    </>
  );
}

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
    <div className="flex justify-between p-2">
      <span className="text-gray-600 text-sm">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
