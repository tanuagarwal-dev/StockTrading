import { UserModel } from "../model/UserModel.js";
import { TransactionModel } from "../model/TransactionModel.js";

export const addFunds = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const user = await UserModel.findById(req.userId);
  const balanceBefore = user.funds.available;
  user.funds.available += Number(amount);
  const balanceAfter = user.funds.available;

  await user.save();

  // Record transaction
  await TransactionModel.create({
    userId: req.userId,
    type: "ADD",
    amount: Number(amount),
    balanceBefore,
    balanceAfter,
    description: "Funds added",
  });

  res.json({ funds: user.funds });
};

export const withdrawFunds = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const user = await UserModel.findById(req.userId);

  if (user.funds.available < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  const balanceBefore = user.funds.available;
  user.funds.available -= Number(amount);
  const balanceAfter = user.funds.available;

  await user.save();

  // Record transaction
  await TransactionModel.create({
    userId: req.userId,
    type: "WITHDRAW",
    amount: Number(amount),
    balanceBefore,
    balanceAfter,
    description: "Funds withdrawn",
  });

  res.json({ funds: user.funds });
};

export const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await TransactionModel.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TransactionModel.countDocuments({ userId: req.userId });

    res.json({
      transactions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};
