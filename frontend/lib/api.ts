import apiClient from "./apiClient";

// ==================== TYPE DEFINITIONS ====================

// Auth Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    funds?: {
      available: number;
      used: number;
    };
    role?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  funds: {
    available: number;
    used: number;
  };
  role: string;
}

// Funds Types
export interface FundsRequest {
  amount: number;
}

export interface FundsResponse {
  funds: {
    available: number;
    used: number;
  };
}

// Transaction Types
export interface Transaction {
  _id: string;
  userId: string;
  type: "ADD" | "WITHDRAW";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTransactionsResponse {
  transactions: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Order Types
export interface PlaceOrderRequest {
  name: string;
  qty: number;
  price?: number;
  mode: "BUY" | "SELL";
  orderType?: "MARKET" | "LIMIT";
}

export interface Order {
  _id?: string;
  user: string;
  name: string;
  qty: number;
  price: number | null;
  mode: "BUY" | "SELL";
  orderType: "MARKET" | "LIMIT";
  status: "EXECUTED" | "REJECTED";
  executedPrice: number | null;
  realizedPnl: number;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Holdings & Positions Types
export interface Holding {
  _id?: string;
  user: string;
  name: string;
  qty: number;
  avg: number;
  price: number;
  net: string;
  day: string;
  isLoss?: boolean;
}

export interface Position {
  _id?: string;
  user: string;
  product: string;
  name: string;
  qty: number;
  avg: number;
  price: number;
  net: string;
  day: string;
  isLoss: boolean;
}

// Market Data Types
export interface PriceData {
  price: number;
  prevClose: number;
}

export interface PriceMap {
  [symbol: string]: PriceData;
}

export interface SinglePrice {
  symbol: string;
  price: number;
  prevClose: number;
}

export interface WatchlistEntry {
  symbol: string;
  price: number | null;
  prevClose?: number | null;
}

export interface PaginatedSymbolsResponse {
  data: { symbol: string }[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OHLCCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// ==================== API CLIENT ====================

class API {
  // ==================== AUTH ENDPOINTS ====================

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  }

  /**
   * Login existing user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  }

  /**
   * Get current user profile (requires auth)
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>("/auth/me");
    return response.data;
  }

  // ==================== FUNDS ENDPOINTS ====================

  /**
   * Add funds to user account (requires auth)
   */
  async addFunds(data: FundsRequest): Promise<FundsResponse> {
    const response = await apiClient.post<FundsResponse>("/funds/add", data);
    return response.data;
  }

  /**
   * Withdraw funds from user account (requires auth)
   */
  async withdrawFunds(data: FundsRequest): Promise<FundsResponse> {
    const response = await apiClient.post<FundsResponse>(
      "/funds/withdraw",
      data
    );
    return response.data;
  }

  /**
   * Get transaction history with pagination (requires auth)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   */
  async getTransactions(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedTransactionsResponse> {
    const response = await apiClient.get<PaginatedTransactionsResponse>(
      "/funds/transactions",
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  // ==================== ORDER ENDPOINTS ====================

  /**
   * Place a new order (requires auth)
   */
  async placeOrder(data: PlaceOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>("/orders", data);
    return response.data;
  }

  /**
   * Place a new order - alternative endpoint (requires auth)
   */
  async placeOrderAlt(data: PlaceOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>("/orders/newOrder1", data);
    return response.data;
  }

  // ==================== HOLDINGS & POSITIONS ====================

  /**
   * Get all holdings for user (requires auth)
   */
  async getAllHoldings(): Promise<Holding[]> {
    const response = await apiClient.get<Holding[]>("/allHoldings");
    return response.data;
  }

  /**
   * Get all positions for user (requires auth)
   */
  async getAllPositions(): Promise<Position[]> {
    const response = await apiClient.get<Position[]>("/allPositions");
    return response.data;
  }

  // ==================== ORDER HISTORY ====================

  /**
   * Get all orders for user - no pagination (requires auth)
   */
  async getAllOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>("/allOrders");
    return response.data;
  }

  /**
   * Get orders with pagination and optional status filter (requires auth)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20, max: 50)
   * @param status - Optional filter by order status (EXECUTED | REJECTED)
   */
  async getOrders(
    page: number = 1,
    limit: number = 20,
    status?: "EXECUTED" | "REJECTED"
  ): Promise<PaginatedOrdersResponse> {
    const params: Record<string, string | number> = { page, limit };
    if (status) params.status = status;

    const response = await apiClient.get<PaginatedOrdersResponse>("/orders", {
      params,
    });
    return response.data;
  }

  /**
   * Get all executed orders - no pagination (requires auth)
   */
  async getAllExecutedOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>("/allExecutedOrders");
    return response.data;
  }

  /**
   * Get executed orders with pagination (requires auth)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20, max: 50)
   */
  async getExecutedOrders(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedOrdersResponse> {
    const response = await apiClient.get<PaginatedOrdersResponse>(
      "/executedOrders",
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  // ==================== MARKET DATA ====================

  /**
   * Get current prices for all symbols (no auth required)
   */
  async getAllPrices(): Promise<PriceMap> {
    const response = await apiClient.get<PriceMap>("/prices");
    return response.data;
  }

  /**
   * Get current price for a specific symbol (no auth required)
   * @param symbol - Stock symbol (e.g., "INFY", "TCS")
   */
  async getPrice(symbol: string): Promise<SinglePrice> {
    const response = await apiClient.get<SinglePrice>(`/price/${symbol}`);
    return response.data;
  }

  /**
   * Get current prices for all symbols via /market namespace (no auth required)
   */
  async getMarketPrices(): Promise<PriceMap> {
    const response = await apiClient.get<PriceMap>("/market/prices");
    return response.data;
  }

  /**
   * Get a single symbol price via /market namespace (no auth required)
   */
  async getMarketPrice(symbol: string): Promise<SinglePrice> {
    const response = await apiClient.get<SinglePrice>(
      `/market/price/${symbol}`
    );
    return response.data;
  }

  async getMarketSymbols(
    page = 1,
    limit = 10
  ): Promise<PaginatedSymbolsResponse> {
    const res = await apiClient.get("/market/symbols", {
      params: { page, limit },
    });
    return res.data;
  }
  // ==================== OHLC CANDLE DATA ====================

  /**
   * Get OHLC candle data for a symbol (no auth required)
   * Returns last 30 one-minute candles
   * @param symbol - Stock symbol (e.g., "INFY", "TCS")
   */
  async getOHLC(symbol: string): Promise<OHLCCandle[]> {
    const response = await apiClient.get<OHLCCandle[]>(`/ohlc/${symbol}`);
    return response.data;
  }

  // ==================== WATCHLIST ====================

  async getWatchlist(): Promise<WatchlistEntry[]> {
    const response = await apiClient.get<WatchlistEntry[]>("/watchlist");
    return response.data;
  }

  async addToWatchlist(symbol: string): Promise<string[]> {
    const response = await apiClient.post<{ watchlist: string[] }>(
      "/watchlist/add",
      { symbol }
    );
    return response.data.watchlist;
  }

  async removeFromWatchlist(symbol: string): Promise<string[]> {
    const response = await apiClient.delete<{ watchlist: string[] }>(
      "/watchlist/remove",
      { data: { symbol } }
    );
    return response.data.watchlist;
  }
}

// Export singleton instance
export const api = new API();

// Export default for convenience
export default api;
