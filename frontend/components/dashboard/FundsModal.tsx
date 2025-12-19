"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";

type Props = {
  type: "ADD" | "WITHDRAW";
  onClose: () => void;
};

// export default function FundsModal({ type, onClose }: Props) {
//   const [amount, setAmount] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const { refreshUser } = useUser();

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       await apiClient.post(type === "ADD" ? "/funds/add" : "/funds/withdraw", {
//         amount,
//       });
//       await refreshUser();
//       onClose();
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//       <div className="bg-white rounded-lg p-6 w-full max-w-sm">
//         <h3 className="text-lg font-semibold mb-4">
//           {type === "ADD" ? "Add Funds" : "Withdraw Funds"}
//         </h3>

//         <input
//           type="number"
//           min={1}
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//           className="w-full border rounded px-3 py-2 mb-3"
//           placeholder="Enter amount"
//         />

//         {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm border rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`px-4 py-2 text-sm text-white rounded ${
//               type === "ADD" ? "bg-green-600" : "bg-blue-600"
//             }`}
//           >
//             {loading ? "Processing..." : "Confirm"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function FundsModal({
  type,
  onClose,
}: {
  type: "ADD" | "WITHDRAW";
  onClose: () => void;
}) {
  const { refreshUser } = useUser();
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const isAdd = type === "ADD";

  const submit = async () => {
    setError(null);
    if (amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    try {
      if (isAdd) {
        await api.addFunds({ amount });
      } else {
        await api.withdrawFunds({ amount });
      }

      await refreshUser();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md w-96 p-6 space-y-4">
        <h3 className="text-lg font-semibold">
          {isAdd ? "Add funds" : "Withdraw funds"}
        </h3>

        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          placeholder="Amount"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className={`px-4 py-2 text-sm rounded text-white ${
              isAdd ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {isAdd ? "Add" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}
