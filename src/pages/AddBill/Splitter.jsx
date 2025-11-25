import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabase/client";

function Splitter({ onBack }) {
  const [total, setTotal] = useState("");
  const [description, setDescription] = useState("");
  const [allPatrons, setAllPatrons] = useState([]); // [{ id, name }]
  const [selectedNames, setSelectedNames] = useState(["Yousef"]);
  const [nameToAdd, setNameToAdd] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [paidNames, setPaidNames] = useState([]); // names marked as already paid

  useEffect(() => {
    const fetchPatrons = async () => {
      try {
        const { data, error } = await supabase
          .from("patrons")
          .select("id,name");
        if (error) {
          console.error("Error fetching patrons:", error);
          setMessage("Failed to fetch patrons.");
        } else {
          setAllPatrons(data || []);
          // Ensure Yousef exists; if not present, keep name but insertion will fail until added.
        }
      } catch (err) {
        console.error("Unexpected error while fetching patrons:", err);
        setMessage("An unexpected error occurred while fetching patrons.");
      }
    };
    fetchPatrons();
  }, []);

  const availableNames = useMemo(() => {
    return allPatrons
      .map((p) => p.name)
      .filter((n) => n !== "You" && !selectedNames.includes(n))
      .sort((a, b) => a.localeCompare(b));
  }, [allPatrons, selectedNames]);

  const selectedWithShares = useMemo(() => {
    const n = selectedNames.length || 0; // include paid in divisor
    const totalCents = Math.round(parseFloat(total || "0") * 100);
    if (!Number.isFinite(totalCents) || totalCents <= 0 || n === 0) {
      return selectedNames.map((name) => ({
        name,
        cents: 0,
        amount: (0).toFixed(2),
        isPaid: paidNames.includes(name),
      }));
    }

    const base = Math.trunc(totalCents / n);
    let remainder = totalCents - base * n;

    // Assign cents to everyone (paid and unpaid), order matters for distributing remainder
    return selectedNames.map((name, idx) => {
      const cents = base + (idx < remainder ? 1 : 0);
      return {
        name,
        cents,
        amount: (cents / 100).toFixed(2),
        isPaid: paidNames.includes(name),
      };
    });
  }, [selectedNames, paidNames, total]);

  const togglePaid = (name) => {
    setPaidNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const removeName = (name) => {
    setSelectedNames((prev) => prev.filter((n) => n !== name));
    setPaidNames((prev) => prev.filter((n) => n !== name));
  };

  const handleSubmit = async () => {
    setMessage(null);
    const totalNum = parseFloat(total);
    if (!Number.isFinite(totalNum) || totalNum <= 0) {
      setMessage("Please enter a valid total greater than 0.");
      return;
    }

    const chargeable = selectedNames.filter((n) => n !== "Yousef");
    if (chargeable.length === 0) {
      setMessage("No one to charge. Add at least one person (not Yousef).");
      return;
    }

    // Map chargeable names (exclude Yousef) to patron IDs
    const { data: patronsFound, error: patronsErr } = await supabase
      .from("patrons")
      .select("id,name")
      .in("name", chargeable);

    if (patronsErr) {
      console.error("Error fetching patron IDs:", patronsErr);
      setMessage("Failed to fetch patron IDs.");
      return;
    }

    const foundNames = new Set((patronsFound || []).map((p) => p.name));
    const missing = chargeable.filter((n) => !foundNames.has(n));
    if (missing.length > 0) {
      setMessage(`These names don't exist yet: ${missing.join(", ")}`);
      return;
    }

    // Build amounts map from selectedWithShares (contains all names)
    const nameToCents = Object.fromEntries(
      selectedWithShares.map((s) => [s.name, s.cents])
    );

    const nowIso = new Date().toISOString();
    const rows = (patronsFound || []).map((p) => {
      const isPaid = paidNames.includes(p.name);
      return {
        value: nameToCents[p.name] / 100,
        description: description || "Split bill",
        patron_id: p.id,
        paid: isPaid,
        paid_at: isPaid ? nowIso : null,
      };
    });

    setSubmitting(true);
    try {
      const { error } = await supabase.from("bills").insert(rows);
      if (error) {
        console.error("Error inserting bills:", error);
        setMessage("Failed to add transactions.");
      } else {
        setMessage("Transactions added successfully!");
        setTotal("");
        setDescription("");
        setSelectedNames(["Yousef"]);
        setPaidNames([]);
        onBack && onBack();
      }
    } catch (err) {
      console.error("Unexpected error while inserting bills:", err);
      setMessage("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = useMemo(() => {
    const hasChargeable = selectedNames.some((n) => n !== "Yousef");
    return hasChargeable && parseFloat(total) > 0;
  }, [selectedNames, total]);

  return (
    <div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <h2 className="text-3xl font-bold">Splitter</h2>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 shadow-md w-full max-w-xs">
          <label className="label">Total Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input input-bordered w-full"
            placeholder="e.g., 123.45"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />

          <label className="label mt-4">Add People</label>
          <div className="w-full">
            <select
              className="select select-bordered w-full"
              value={nameToAdd || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val && !selectedNames.includes(val)) {
                  setSelectedNames((prev) => [...prev, val]);
                }
                setNameToAdd("");
              }}
            >
              <option value="" disabled>
                Select to add
              </option>
              {availableNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedNames.map((name) => (
              <button
                key={name}
                type="button"
                className="badge badge-accent gap-1 cursor-pointer hover:badge-error"
                onClick={() => removeName(name)}
                title={`Remove ${name}`}
              >
                {name}
              </button>
            ))}
          </div>

          {selectedWithShares.length > 0 && (
            <div className="overflow-x-auto bg-base-100 border-4 border-base-300 shadow-md rounded-box p-4 mt-4">
              <table className="table table-compact">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedWithShares.map((row, idx) => (
                    <tr key={row.name} className={row.isPaid ? "opacity-60" : ""}>
                      <td>{idx + 1}</td>
                      <td
                        className={row.isPaid ? "line-through cursor-pointer" : "cursor-pointer"}
                        onClick={() => togglePaid(row.name)}
                        title={row.isPaid ? "Mark as unpaid" : "Mark as paid"}
                      >
                        {row.name}
                      </td>
                      <td className={row.isPaid ? "line-through" : ""}>${row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <label className="label mt-4">Description (optional)</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g., Dinner at ABC"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="btn btn-accent mt-4 w-full"
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
          >
            {submitting ? "Adding..." : "Add Transaction"}
          </button>
        </fieldset>
        {message && <p className="text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}

export default Splitter;
