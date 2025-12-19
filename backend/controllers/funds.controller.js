import { UserModel } from "../model/UserModel.js";

export const addFunds = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const user = await UserModel.findById(req.userId);
  user.funds.available += Number(amount);

  await user.save();
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

  user.funds.available -= Number(amount);
  await user.save();

  res.json({ funds: user.funds });
};