"use client";

import { createContext, useState, ReactNode } from "react";
import BuyActionWindow from "../components/dashboard/BuyActionWindow";

type GeneralContextType = {
  openBuyWindow: (uid: string) => void;
  closeBuyWindow: () => void;
};

const GeneralContext = createContext<GeneralContextType>({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
});

export function GeneralContextProvider({ children }: { children: ReactNode }) {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState<string | null>(null);

  const openBuyWindow = (uid: string) => {
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
        closeBuyWindow,
      }}
    >
      {children}

      {isBuyWindowOpen && selectedStockUID && (
        <BuyActionWindow uid={selectedStockUID} />
      )}
    </GeneralContext.Provider>
  );
}

export default GeneralContext;
