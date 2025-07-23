import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/client";

function PayBalances() {
  const { name } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [message, setMessage] = useState(null);
  const [viewingAll, setViewingAll] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: patron, error: patronError } = await supabase
          .from("patrons")
          .select("id")
          .eq("name", name)
          .single();

        if (patronError || !patron) {
          setMessage("Patron not found.");
          return;
        }

        const { data: transactions, error: transactionsError } = await supabase
          .from("bills")
          .select("id, description, value")
          .eq("patron_id", patron.id)
          .eq("paid", false);

        if (transactionsError) {
          setMessage("Failed to fetch transactions.");
        } else {
          setTransactions(transactions);
          const total = transactions.reduce((sum, transaction) => sum + transaction.value, 0);
          setTotalBalance(total);
        }
      } catch (error) {
        setMessage("An unexpected error occurred.");
      }
    };

    fetchTransactions();
  }, [name]);

  const openModal = (method) => {
    setSelectedMethod(method);
    document.getElementById("payment_modal").showModal();
  };

  const confirmPayment = async () => {
    try {
      const { data: patron, error: patronError } = await supabase
        .from("patrons")
        .select("id")
        .eq("name", name)
        .single();

      if (patronError || !patron) {
        setMessage("Patron not found.");
        return;
      }

      const { error: updateError } = await supabase
        .from("bills")
        .update({ paid: true, paid_at: new Date().toISOString() })
        .eq("patron_id", patron.id);

      if (updateError) {
        setMessage("Failed to update transactions.");
      } else {
        setMessage("Payment confirmed successfully!");
        setTransactions([]);
        setTotalBalance(0);
        document.getElementById("payment_modal").close();
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const { data: patron, error: patronError } = await supabase
        .from("patrons")
        .select("id")
        .eq("name", name)
        .single();

      if (patronError || !patron) {
        setMessage("Patron not found.");
        return;
      }

      const { data: transactions, error: transactionsError } = await supabase
        .from("bills")
        .select("id, description, value, paid")
        .eq("patron_id", patron.id);

      if (transactionsError) {
        setMessage("Failed to fetch transactions.");
      } else {
        setTransactions(transactions);
        const total = transactions.reduce((sum, transaction) => sum + transaction.value, 0);
        setTotalBalance(total);
        setViewingAll(true);
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    }
  };

  const fetchUnpaidTransactions = async () => {
    try {
      const { data: patron, error: patronError } = await supabase
        .from("patrons")
        .select("id")
        .eq("name", name)
        .single();

      if (patronError || !patron) {
        setMessage("Patron not found.");
        return;
      }

      const { data: transactions, error: transactionsError } = await supabase
        .from("bills")
        .select("id, description, value")
        .eq("patron_id", patron.id)
        .eq("paid", false);

      if (transactionsError) {
        setMessage("Failed to fetch transactions.");
      } else {
        setTransactions(transactions);
        const total = transactions.reduce((sum, transaction) => sum + transaction.value, 0);
        setTotalBalance(total);
        setViewingAll(false);
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 h-[94vh]">
        <div className="hero-content text-center">
          <div className="max-w-lg bg-base-100 p-6 shadow-md rounded-box sm:w-lg w-xs">
            <h2 className="text-3xl font-bold">{name}'s Balance</h2>
            <div className="overflow-x-auto bg-base-100 shadow-md rounded-box p-5 mt-4">
              <table className="table sm:table-md table-sm table-zebra">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr
                        key={transaction.id}
                        className={viewingAll && transaction.paid ? "line-through" : ""}
                      >
                        <th>{index + 1}</th>
                        <td>{transaction.description}</td>
                        <td>${transaction.value.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        {viewingAll ? "No transaction history." : message || "No unpaid transactions."}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th>=</th>
                    <th>Total</th>
                    <th>${totalBalance.toFixed(2)}</th>
                  </tr>
                </tfoot>
              </table>
              <div className="flex justify-between mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={viewingAll ? fetchUnpaidTransactions : fetchAllTransactions}
                >
                  {viewingAll ? "Back to Unpaid" : "All Transactions"}
                </button>
                {!viewingAll && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedMethod("Direct"); // Default method
                      document.getElementById("payment_modal").showModal();
                    }}
                    disabled={transactions.length === 0}
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog id="payment_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Payment Confirmation</h3>
          <p className="py-4">
            I certify that I have sent Yousef ${totalBalance.toFixed(2)}.
          </p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("payment_modal").close()}
            >
              Go Back
            </button>
            <button className="btn btn-primary" onClick={confirmPayment}>
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default PayBalances;