import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";

function UseTab({ onBack, requeryTrigger }) {
  const [parsedData, setParsedData] = useState([]);
  const [appOutput, setAppOutput] = useState("");
  const [isParsed, setIsParsed] = useState(false);
  const [users, setUsers] = useState([]);

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
    const regex = /-{2,}\n(\w+):[\s\S]*?All Up\s+\$(\d+\.\d{2})/g;
    const matches = [...appOutput.matchAll(regex)];
    const data = matches.map((match, index) => ({
      id: index + 1,
      nickname: match[1],
      amount: match[2],
    }));
    setParsedData(data);
    setIsParsed(true);
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
                      <td>${row.amount}</td>
                      <td>
                        <select className="select select-bordered select-sm">
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
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UseTab;
