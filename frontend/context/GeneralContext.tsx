"use client";

import { createContext, useState, ReactNode } from "react";
import BuyActionWindow from "../components/dashboard/BuyActionWindow";

type Side = "BUY" | "SELL";

type GeneralContextType = {
  openBuyWindow: (uid: string) => void;
  openSellWindow: (uid: string) => void;
  closeBuyWindow: () => void;
};

const GeneralContext = createContext<GeneralContextType>({
  openBuyWindow: () => {},
  openSellWindow: () => {},
  closeBuyWindow: () => {},
});

export function GeneralContextProvider({ children }: { children: ReactNode }) {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState<string | null>(null);
  const [side, setSide] = useState<Side>("BUY");

  const openBuyWindow = (uid: string) => {
    setSide("BUY");
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const openSellWindow = (uid: string) => {
    setSide("SELL");
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const closeBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID(null);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow,
        openSellWindow,
        closeBuyWindow,
      }}
    >
      {children}

      {isBuyWindowOpen && selectedStockUID && (
        <BuyActionWindow uid={selectedStockUID} mode={side} />
      )}
    </GeneralContext.Provider>
  );
}

export default GeneralContext;
