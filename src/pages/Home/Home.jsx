import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";

function Home() {
  const [patrons, setPatrons] = useState([]);
  const [message, setMessage] = useState(null);
  const [newPatronName, setNewPatronName] = useState("");

  useEffect(() => {
    const fetchPatronsWithBalances = async () => {
      try {
        const { data, error } = await supabase.rpc("get_patron_balances");

        if (error) {
          console.error("Error fetching patrons with balances:", error);
          setMessage("Failed to fetch patrons.");
        } else {
          setPatrons(data);
        }
      } catch (error) {
        console.error("Unexpected error while fetching patrons:", error);
        setMessage("An unexpected error occurred.");
      }
    };

    fetchPatronsWithBalances();
  }, []);

  const addPatron = async () => {
    if (!newPatronName.trim()) {
      setMessage("Patron name cannot be empty.");
      return;
    }

    try {
      const { error } = await supabase
        .from("patrons")
        .insert({ name: newPatronName.trim() });

      if (error) {
        console.error("Error adding patron:", error);
        setMessage("Failed to add patron.");
      } else {
        setMessage("Patron added successfully!");
        setNewPatronName("");
        document.getElementById("add_patron_modal").close(); // Close the modal
        // Optionally refresh the patrons list
        const { data, error: fetchError } = await supabase.rpc(
          "get_patron_balances"
        );
        if (!fetchError) setPatrons(data);
      }
    } catch (error) {
      console.error("Unexpected error while adding patron:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 h-[94vh]">
        <div className="hero-content text-center">
          <div className="max-w-lg flex flex-col gap-5">
            <h1 className="text-4xl font-bold">Account Balances</h1>
            <p className="py-2">
              Welcome to the Bank of YAK! <br />
              Thank you for your patronage. Now pay me back.
            </p>
            <div className="overflow-x-auto bg-base-100 shadow-md rounded-box p-5">
              <table className="table table-lg table-zebra">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {patrons.length > 0 ? (
                    patrons.map((patron, index) => (
                      <tr key={patron.id}>
                        <th>{index + 1}</th>
                        <td>
                          <Link
                            className="hover:underline"
                            to={`/pay-balances/${patron.name}`}
                          >
                            {patron.name}
                          </Link>
                        </td>
                        <td>${patron.balance.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        {message || "Loading..."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col">
              <Link to="/add-bill">
                <button className="btn btn-primary w-full">Add Bill</button>
              </Link>
              <button
                className="btn btn-secondary w-full mt-4"
                onClick={() => document.getElementById("add_patron_modal").showModal()}
              >
                Add Patron
              </button>
            </div>

            <dialog id="add_patron_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Add New Patron</h3>
                <input
                  type="text"
                  placeholder="Enter patron name"
                  className="input input-bordered w-full mt-4"
                  value={newPatronName}
                  onChange={(e) => setNewPatronName(e.target.value)}
                />
                <div className="modal-action">
                  <button
                    className="btn"
                    onClick={() => document.getElementById("add_patron_modal").close()}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={addPatron}>
                    Add
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
