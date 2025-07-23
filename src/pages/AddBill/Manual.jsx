import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";

function Manual({ onBack, requeryTrigger }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState(null);
  const [patrons, setPatrons] = useState([]);

  useEffect(() => {
    const fetchPatrons = async () => {
      try {
        const { data, error } = await supabase.from("patrons").select("name");
        if (error) {
          console.error("Error fetching patrons:", error);
          setMessage("Failed to fetch patrons.");
        } else {
          setPatrons(data);
        }
      } catch (error) {
        console.error("Unexpected error while fetching patrons:", error);
        setMessage("An unexpected error occurred while fetching patrons.");
      }
    };

    fetchPatrons();
  }, [requeryTrigger]);

  const handleSubmit = async () => {
    try {
      // Find the patron by name
      const { data: patron, error: patronError } = await supabase
        .from("patrons")
        .select("id")
        .eq("name", name)
        .single();

      if (patronError || !patron) {
        setMessage("Patron not found.");
        return;
      }

      const payload = {
        description: reason,
        value: parseFloat(amount),
        patron_id: patron.id,
      };

      // Insert the bill into the database
      const { error: billError } = await supabase.from("bills").insert(payload);

      if (billError) {
        setMessage("Failed to add the bill.");
      } else {
        setMessage("Bill added successfully!");
        setName("");
        setAmount("");
        setReason("");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 justify-center items-center">
        <h2 className="text-3xl font-bold">Manual Input</h2>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 shadow-md w-full max-w-xs">
          <label className="label">Select a Name</label>
          <select
            className="select select-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="" disabled>
              Pick a name
            </option>
            {patrons.map((patron) => (
              <option key={patron.name} value={patron.name}>
                {patron.name}
              </option>
            ))}
          </select>
          <label className="label mt-4">Amount Owed</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Amount owed"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <label className="label mt-4">Reason</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Reason for transaction"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button className="btn btn-neutral mt-4" onClick={handleSubmit}>
            Add Transaction
          </button>
        </fieldset>
        {message && <p className="text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}

export default Manual;
