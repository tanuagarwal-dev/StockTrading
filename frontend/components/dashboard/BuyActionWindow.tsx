"use client";

import { useState, useContext, useEffect } from "react";
import GeneralContext from "@/context/GeneralContext";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";

type Side = "BUY" | "SELL";

type Props = {
  uid: string;
  mode: Side;
  onClose?: () => void;
};

export default function BuyActionWindow({ uid, mode, onClose }: Props) {
  const { closeBuyWindow } = useContext(GeneralContext);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useUser();
  const [stockQuantity, setStockQuantity] = useState<number>(1);
  const [stockPrice, setStockPrice] = useState<number>(1);
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      // await apiClient.post("/newOrder", {
      //   name: uid,
      //   qty: stockQuantity,
      //   price: stockPrice,
      //   mode,
      //   orderType,
      // });
      const order = await api.placeOrder({
        name: uid,
        qty: stockQuantity,
        mode,
        orderType,
        ...(orderType === "LIMIT" ? { price: stockPrice } : {}),
      });
      // await apiClient.post("/newOrder", {
      //   name: uid,
      //   qty: stockQuantity,
      //   mode,
      //   orderType,
      //   ...(orderType === "LIMIT" ? { price: stockPrice } : {}),
      // });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("portfolio-updated"));
      }
      await refreshUser();
      (onClose ?? closeBuyWindow)();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Order failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (orderType === "MARKET") {
      setStockPrice(0);
    }
  }, [orderType]);
  const isBuy = mode === "BUY";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 text-black flex items-end justify-center">
      <div
        draggable
        className="relative w-[40%] h-[63%] bg-[#f5f5f5] border border-[#eee] rounded-md shadow-lg cursor-move"
      >
        <div className="bg-[#4184f3] px-4 py-3 rounded-t-md">
          <h3 className=" text-base font-medium">
            {isBuy ? "Buy" : "Sell"} {uid}{" "}
            <span className="text-xs font-normal">NSE</span>
          </h3>
          <p className="text-white text-xs font-light mt-1">
            {orderType === "MARKET" ? "Market" : "Limit"} • Delivery
          </p>
        </div>

        <div className="bg-white px-6 py-5 h-[calc(100%-120px)]">
          <div className="flex gap-4 mt-4">
            <fieldset className="border border-gray-300 px-3 py-1 w-30">
              <legend className="text-xs px-1 text-gray-700">Qty.</legend>
              <input
                title="quantity"
                type="number"
                min={1}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full text-lg outline-none"
              />
            </fieldset>

            <fieldset className="border border-gray-300 px-3 py-1 w-30">
              <legend className="text-xs px-1 text-gray-400">Price</legend>
              <input
                title="price"
                type="number"
                step="0.05"
                disabled={orderType === "MARKET"}
                value={stockPrice}
                onChange={(e) => setStockPrice(Number(e.target.value))}
                className="w-full text-lg outline-none"
              />
            </fieldset>

            <fieldset className="border border-gray-300 px-3 py-1 w-35">
              <legend className="text-xs px-1 text-gray-700">Order type</legend>
              <select
                title="order-type"
                value={orderType}
                onChange={(e) =>
                  setOrderType(e.target.value as "MARKET" | "LIMIT")
                }
                className="w-full text-sm outline-none bg-white"
              >
                <option value="MARKET">MARKET</option>
                <option value="LIMIT">LIMIT</option>
              </select>
            </fieldset>
          </div>
        </div>
        {error && <div className="text-xs text-red-600 mt-2">{error}</div>}

        <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between items-center">
          <span className="text-xs text-gray-600">Delivery only</span>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#4184f3] text-white text-sm rounded hover:bg-[#74a7fa]"
            >
              {isSubmitting ? "Placing..." : isBuy ? "Buy" : "Sell"}
            </button>

            <button
              onClick={onClose ?? closeBuyWindow}
              className="px-5 py-2 bg-[#d4d4d4] text-gray-700 text-sm rounded hover:bg-[#9b9b9b] hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
