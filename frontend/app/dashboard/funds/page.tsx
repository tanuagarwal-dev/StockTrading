"use client";

import Menu from "@/components/dashboard/Menu";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import FundsModal from "@/components/dashboard/FundsModal";
import { api, Transaction } from "@/lib/api";

export default function Funds() {
  const { user } = useUser();
  const [modal, setModal] = useState<"ADD" | "WITHDRAW" | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  if (!user) return null;

  const available = user?.funds?.available ?? 0;
  const used = user?.funds?.used ?? 0;
  const total = available + used; // opening & live (simulator)

  const fetchTransactions = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await api.getTransactions(pageNum, 20);
      setTransactions(response.transactions);
      setMeta(response.meta);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleModalClose = () => {
    setModal(null);
    // Refresh transactions after adding/withdrawing funds
    fetchTransactions(page);
  };

  return (
    <>
      

      {modal && <FundsModal type={modal} onClose={handleModalClose} />}

      <section className="space-y-6 p-4">
        <div className="flex justify-between items-center border p-4 bg-white dark:bg-gray-800 rounded">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Instant, zero-cost fund transfers (mock)
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setModal("ADD")}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            >
              Add funds
            </button>
            <button
              onClick={() => setModal("WITHDRAW")}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="rounded-md border bg-white dark:bg-gray-800 p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Equity
          </p>

          <Row
            label="Available margin"
            value={available.toFixed(2)}
            highlight
          />
          <Row label="Used margin" value={used.toFixed(2)} />
          <Row label="Available cash" value={available.toFixed(2)} />

          <hr className="dark:border-gray-700" />

          <Row label="Opening balance" value={total.toFixed(2)} />
          <Row label="Live balance" value={total.toFixed(2)} />
          <Row label="Payin" value="—" />
          <Row label="SPAN" value="0.00" />
          <Row label="Delivery margin" value={used.toFixed(2)} />
          <Row label="Exposure" value={used.toFixed(2)} />
          <Row label="Options premium" value="0.00" />

          <hr className="dark:border-gray-700" />

          <Row label="Total collateral" value="0.00" />
        </div>

        {/* Transaction History Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>

          {loading && transactions.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Loading transactions...
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                No transactions found
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Balance Before
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Balance After
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === "ADD"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {transaction.type === "ADD"
                              ? "➕ Add"
                              : "➖ Withdraw"}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-medium ${
                            transaction.type === "ADD"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "ADD" ? "+" : "-"}
                          {formatAmount(transaction.amount)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                          {formatAmount(transaction.balanceBefore)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatAmount(transaction.balanceAfter)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {transaction.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {meta && meta.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {meta.page} of {meta.totalPages} ({meta.total} total
                    transactions)
                  </span>

                  <button
                    disabled={page === meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
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
