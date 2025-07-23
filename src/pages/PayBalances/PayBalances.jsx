import { useState } from "react";

// Testing Nathan as the Dummy User

function PayBalances() {
  const transactions = [
    { id: 1, description: "Dinner at Yakitori", amount: 25.48 },
    { id: 2, description: "Shared Sashimi Bowl", amount: 13.50 },
    { id: 3, description: "Drinks at Bar", amount: 10.00 },
  ];

  const totalBalance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  return (
    <div>
      <div className="hero bg-base-200 h-[94vh]">
        <div className="hero-content text-center">
          <div className="max-w-lg bg-base-100 p-6 shadow-md rounded-box w-lg">
            <h2 className="text-3xl font-bold">Nathan's Balance</h2>
            <div className="overflow-x-auto bg-base-100 shadow-md rounded-box p-5 mt-4">
              <table className="table table-md table-zebra">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <th>{transaction.id}</th>
                      <td>{transaction.description}</td>
                      <td>${transaction.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>=</th>
                    <th>Total</th>
                    <th>${totalBalance.toFixed(2)}</th>
                  </tr>
                </tfoot>
              </table>
              {!showPaymentOptions ? (
                <button
                  className="btn btn-primary w-full mt-4"
                  onClick={() => setShowPaymentOptions(true)}
                >
                  Pay
                </button>
              ) : (
                <div className="join w-full mt-4 justify-center">
                  <button className="btn btn-accent w-1/3 join-item">Zelle</button>
                  <button className="btn btn-secondary w-1/3 join-item">Venmo</button>
                  <button className="btn btn-accent w-1/3 join-item">Cash</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayBalances;