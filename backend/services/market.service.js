export const prices = {
  INFY: 1555.45,
  ONGC: 116.8,
  TCS: 3194.8,
  KPITTECH: 266.45,
  QUICKHEAL: 308.55,
  WIPRO: 577.75,
  "M&M": 779.8,
  RELIANCE: 2112.4,
  HUL: 512.4,
  BHARTIARTL: 541.15,
  HDFCBANK: 1522.35,
  HINDUNILVR: 2417.4,
  ITC: 207.9,
  SBIN: 430.2,
  SGBMAY29: 4719.0,
  TATAPOWER: 124.15,
};
export const getCurrentPriceForSymbol = (symbol) => {
  // Minimal simulated price feed; extend as needed.

  // return prices[symbol] ?? 100;
  return simulatedPrices[symbol].price ?? 100;
};

// --- In-memory simulated market prices (independent of execution logic) ---
export const simulatedPrices = {
  INFY: { price: 1555.45, prevClose: 1540.0 },
  TCS: { price: 3194.8, prevClose: 3180.0 },
  RELIANCE: { price: 2112.4, prevClose: 2090.0 },
  ONGC: { price: 116.8, prevClose: 115.5 },
  KPITTECH: { price: 266.45, prevClose: 262.0 },
  QUICKHEAL: { price: 308.55, prevClose: 310.2 },
  WIPRO: { price: 577.75, prevClose: 572.0 },
  "M&M": { price: 779.8, prevClose: 785.0 },
  HUL: { price: 512.4, prevClose: 510.0 },
  BHARTIARTL: { price: 541.15, prevClose: 538.0 },
  HDFCBANK: { price: 1522.35, prevClose: 1510.0 },
  HINDUNILVR: { price: 2417.4, prevClose: 2405.0 },
  ITC: { price: 207.9, prevClose: 206.5 },
  SBIN: { price: 430.2, prevClose: 425.0 },
  SGBMAY29: { price: 4719.0, prevClose: 4725.0 },
  TATAPOWER: { price: 124.15, prevClose: 122.8 },
};

export const getAllSymbols = () => Object.keys(simulatedPrices);

export const getPrice = (symbol) => {
  return simulatedPrices[symbol].price ?? null;
};

export const updateSimulatedPrices = () => {
  Object.keys(simulatedPrices).forEach((symbol) => {
    const current = simulatedPrices[symbol];
    const delta = (Math.random() * 0.01 - 0.005) * current.price; // ±0.5%
    const next = current.price + delta;
    simulatedPrices[symbol].price = Math.max(1, next);
  });
};

// update every 5 seconds
setInterval(updateSimulatedPrices, 5000);
