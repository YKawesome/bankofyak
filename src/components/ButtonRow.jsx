import React, { useState } from "react";
import { supabase } from "../supabase/client";

function ButtonRow({ onBack, onPatronAdded }) {
  const [newPatronName, setNewPatronName] = useState("");
  const [message, setMessage] = useState(null);

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
        setNewPatronName("");
        document.getElementById("add_patron_modal").close(); // Close the modal
        if (onPatronAdded) onPatronAdded();
      }
    } catch (error) {
      console.error("Unexpected error while adding patron:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex justify-between w-full mt-5">
      <button className="btn btn-secondary" onClick={onBack}>
        Back
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => document.getElementById("add_patron_modal").showModal()}
      >
        Add Patron
      </button>

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
          {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
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
  );
}

export default ButtonRow;
