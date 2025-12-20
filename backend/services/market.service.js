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
  return simulatedPrices[symbol] ?? 100;
};

// --- In-memory simulated market prices (independent of execution logic) ---
export const simulatedPrices = {
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
export const getAllSymbols = () => Object.keys(simulatedPrices);

export const getPrice = (symbol) => {
  return simulatedPrices[symbol] ?? null;
};
export const updateSimulatedPrices = () => {
  Object.keys(simulatedPrices).forEach((symbol) => {
    const current = simulatedPrices[symbol];
    const delta = (Math.random() * 0.01 - 0.005) * current; // ±0.5%
    const next = current + delta;
    simulatedPrices[symbol] = Math.max(1, next);
  });
};

// update every 5 seconds
setInterval(updateSimulatedPrices, 5000);
