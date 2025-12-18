"use client";
import { useEffect, useState } from "react";
import axios, { all } from "axios";
import Menu from "@/components/dashboard/Menu";
import Link from "next/link";

type Order = {
  name: string;
  qty: number;
  price: number;
  mode: string;
};
export default function Orders() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);

    useEffect(() => {
      axios.get("http://localhost:3002/allOrders").then((res) => {
        setAllOrders(res.data);
      });
    }, []);

    const labels = allOrders.map((h) => h.name);

    const data = {
      labels,
      datasets: [
        {
          label: "Stock Price",
          data: allOrders.map((h) => h.price),
          backgroundColor: "rgba(59,130,246,0.6)", // Tailwind blue
        },
      ],
    };
  return (
    <>
      <Menu />
      {allOrders.length === 0 ? (
        <div className="p-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              You haven&apos;t placed any orders today
            </p>

            <Link
              href="/"
              className="inline-block rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-4">
          <h3 className="text-lg font-semibold">Orders ({allOrders.length})</h3>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-center">Qty</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Mode</th>
                </tr>
              </thead>

              <tbody>
                {allOrders.map((stock: Order, index: number) => {
                  return (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2">{stock.name}</td>
                      <td className="px-3 py-2 text-center">{stock.qty}</td>
                      <td className="px-3 py-2">{stock.price}</td>
                      <td className="px-3 py-2">{stock.mode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
