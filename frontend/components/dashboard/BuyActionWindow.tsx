"use client";

import { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "@/context/GeneralContext";

type Props = {
  uid: string;
};

export default function BuyActionWindow({ uid }: Props) {
  const { closeBuyWindow } = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState<number>(1);
  const [stockPrice, setStockPrice] = useState<number>(0);

  const handleBuyClick = async () => {
    await axios.post("http://localhost:3002/newOrder", {
      name: uid,
      qty: stockQuantity,
      price: stockPrice,
      mode: "BUY",
    });

    closeBuyWindow();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      {/* Window */}
      <div
        draggable
        className="relative w-[40%] h-[63%] bg-[#f5f5f5] border border-[#eee] rounded-md shadow-lg cursor-move"
      >
        {/* Header */}
        <div className="bg-[#4184f3] px-4 py-3 rounded-t-md">
          <h3 className="text-white text-base font-medium">
            Buy {uid} <span className="text-xs font-normal">NSE</span>
          </h3>
          <p className="text-white text-xs font-light mt-1">
            Market • Intraday
          </p>
        </div>

        {/* Body */}
        <div className="bg-white px-6 py-5 h-[calc(100%-120px)]">
          {/* Inputs */}
          <div className="flex gap-4 mt-4">
            {/* Qty */}
            <fieldset className="border border-gray-300 px-3 py-1 w-[120px]">
              <legend className="text-xs px-1 text-gray-700">Qty.</legend>
              <input title="quantity"
                type="number"
                min={1}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full text-lg outline-none"
              />
            </fieldset>

            {/* Price */}
            <fieldset className="border border-gray-300 px-3 py-1 w-[120px]">
              <legend className="text-xs px-1 text-gray-400">Price</legend>
              <input title="price"
                type="number"
                step="0.05"
                value={stockPrice}
                onChange={(e) => setStockPrice(Number(e.target.value))}
                className="w-full text-lg outline-none"
              />
            </fieldset>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between items-center">
          <span className="text-xs text-gray-600">Margin required ₹140.65</span>

          <div className="flex gap-2">
            <button
              onClick={handleBuyClick}
              className="px-5 py-2 bg-[#4184f3] text-white text-sm rounded hover:bg-[#74a7fa]"
            >
              Buy
            </button>

            <button
              onClick={closeBuyWindow}
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
