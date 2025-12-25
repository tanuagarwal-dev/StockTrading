// Mock market indices data with live updating
let marketIndices = {
  SENSEX: {
    symbol: "SENSEX",
    name: "BSE SENSEX",
    value: 77500,
    previousClose: 77200,
    high: 77800,
    low: 77100,
    lastUpdate: new Date(),
  },
  NIFTY: {
    symbol: "NIFTY",
    name: "NIFTY 50",
    value: 23650,
    previousClose: 23450,
    high: 23800,
    low: 23500,
    lastUpdate: new Date(),
  },
};

// Simulate price updates every 5 seconds
setInterval(() => {
  Object.keys(marketIndices).forEach((symbol) => {
    const index = marketIndices[symbol];
    const change = (Math.random() - 0.5) * 50; // Random change between -25 and +25
    const newValue = Math.max(index.previousClose * 0.95, index.value + change);

    // Update high and low
    if (newValue > index.high) {
      index.high = newValue;
    }
    if (newValue < index.low) {
      index.low = newValue;
    }

    index.value = parseFloat(newValue.toFixed(2));
    index.lastUpdate = new Date();
  });
}, 5000);

export const getMarketIndices = () => {
  return Object.keys(marketIndices).map((symbol) => {
    const index = marketIndices[symbol];
    const change = index.value - index.previousClose;
    const changePercent = (change / index.previousClose) * 100;

    return {
      symbol: index.symbol,
      name: index.name,
      value: index.value,
      previousClose: index.previousClose,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: index.high,
      low: index.low,
      lastUpdate: index.lastUpdate,
    };
  });
};

export const getMarketIndex = (symbol) => {
  const upperSymbol = symbol.toUpperCase();
  const index = marketIndices[upperSymbol];

  if (!index) {
    return null;
  }

  const change = index.value - index.previousClose;
  const changePercent = (change / index.previousClose) * 100;

  return {
    symbol: index.symbol,
    name: index.name,
    value: index.value,
    previousClose: index.previousClose,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    high: index.high,
    low: index.low,
    lastUpdate: index.lastUpdate,
  };
};
