import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";

function UseTab({ onBack, requeryTrigger }) {
  const [parsedData, setParsedData] = useState([]);
  const [appOutput, setAppOutput] = useState("");
  const [isParsed, setIsParsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [transactionReason, setTransactionReason] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("patrons")
          .select("name")
          .neq("name", "You"); // Exclude 'You'

        if (error) {
          console.error("Error fetching users:", error);
        } else {
          setUsers(data);
        }
      } catch (error) {
        console.error("Unexpected error while fetching users:", error);
      }
    };

    fetchUsers();
  }, [requeryTrigger]);

  const parseOutput = () => {
    if (!appOutput.trim()) {
      alert("Please paste valid app output before parsing.");
      return;
    }

    const regex = /-{2,}\n(\w+):[\s\S]*?All Up\s+\$(\d+\.\d{2})/g;
    const matches = [...appOutput.matchAll(regex)];

    if (matches.length === 0) {
      alert("Failed to parse the app output. Please check the format and try again.");
      return;
    }

    const data = matches.map((match, index) => ({
      id: index + 1,
      nickname: match[1],
      amount: match[2],
    }));

    setParsedData(data);
    setIsParsed(true);
  };

  const submitTransactions = async () => {
    if (!transactionReason) {
      alert("Please provide a reason for the transaction.");
      return;
    }

    const transactionsToSubmit = await Promise.all(
      parsedData.map(async (row) => {
        const selectElement = document.querySelector(
          `select[data-id='${row.id}']`
        );

        if (!selectElement) {
          console.error(`Select element not found for row ID: ${row.id}`);
          return null; // Skip this row if the select element is not found
        }

        const selectedName = selectElement.value;

        if (selectedName === "Select Name") {
          return null; // Skip if no name is selected
        }

        try {
          const { data: patron, error: patronError } = await supabase
            .from("patrons")
            .select("id")
            .eq("name", selectedName)
            .single();

          if (patronError || !patron) {
            console.error(`Failed to fetch patron ID for name: ${selectedName}`);
            return null; // Skip if patron ID cannot be fetched
          }

          return {
            value: parseFloat(row.amount),
            description: transactionReason, // Updated to use 'description' instead of 'reason'
            patron_id: patron.id, // Use patron ID instead of name
          };
        } catch (error) {
          console.error(`Unexpected error while fetching patron ID for name: ${selectedName}`, error);
          return null;
        }
      })
    );

    const filteredTransactions = transactionsToSubmit.filter(Boolean); // Remove null entries

    try {
      const { error } = await supabase.from("bills").insert(filteredTransactions);

      if (error) {
        console.error("Error submitting transactions:", error);
        alert("Failed to submit transactions.");
      } else {
        alert("Transactions submitted successfully!");
        setTransactionReason("");
        onBack(); // Navigate back to the AddBill page
      }
    } catch (error) {
      console.error("Unexpected error while submitting transactions:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 justify-center items-center">
        <h2 className="text-3xl font-bold">Use Tab</h2>
        {!isParsed && (
          <div className="w-7/8">
            <textarea
              className="textarea w-full"
              placeholder="Paste app output here"
              value={appOutput}
              onChange={(e) => setAppOutput(e.target.value)}
            ></textarea>
            <button
              className="btn btn-neutral w-full mt-4"
              onClick={parseOutput}
            >
              Parse
            </button>
          </div>
        )}
        {parsedData.length > 0 && (
          <div className="overflow-x-auto bg-base-100 border-4 border-base-300 shadow-md rounded-box p-5">
            <table className="table md:table-md table-xs table-zebra">
              <thead>
                <tr className="md:text-lg text-xs">
                  <th>#</th>
                  <th>Nickname</th>
                  <th>Amount</th>
                  <th>Real Name</th>
                </tr>
              </thead>
              <tbody>
                {parsedData
                  .filter((row) => row.nickname !== "You") // Exclude rows where Nickname is 'You'
                  .map((row) => (
                    <tr key={row.id}>
                      <th>{row.id}</th>
                      <td>{row.nickname}</td>
                      <td
                        className="hover:line-through cursor-pointer"
                        onClick={() =>
                          setParsedData(
                            parsedData.filter((item) => item.id !== row.id)
                          )
                        }
                      >
                        ${row.amount}
                      </td>
                      <td>
                        <select
                          className="select select-bordered select-sm"
                          data-id={row.id}
                        >
                          <option disabled selected>
                            Select Name
                          </option>
                          {users.map((user) => (
                            <option key={user.name} value={user.name}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">
                    <div className="form-control">
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={transactionReason}
                        onChange={(e) => setTransactionReason(e.target.value)}
                        placeholder="Enter reason"
                      />
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
            <button
              className="btn btn-accent w-full"
              onClick={submitTransactions}
            >
              Submit Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UseTab;
