import { useState } from "react";

function AddBill() {
  const [view, setView] = useState("default");

  const renderContent = () => {
    switch (view) {
      case "manual":
        return <Manual onBack={() => setView("default")} />;
      case "tab":
        return <UseTab onBack={() => setView("default")} />;
      case "splitter":
        return <Splitter onBack={() => setView("default")} />;
      default:
        return (
          <>
            <h1 className="text-5xl font-bold">Add Bill</h1>
            <p className="py-6">
              For Yousef :) <br />
              Pick the input source.
            </p>
            <div className="join w-full justify-center">
              <button
                className="btn btn-accent join-item"
                onClick={() => setView("manual")}
              >
                Manual
              </button>
              <button
                className="btn btn-secondary join-item"
                onClick={() => setView("tab")}
              >
                Use Tab
              </button>
              <button
                className="btn btn-accent join-item"
                onClick={() => setView("splitter")}
              >
                Splitter
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 h-[94vh]">
        <div className="hero-content text-center">
          <div className="max-w-lg bg-base-100 p-6 shadow-md rounded-box w-lg">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBill;

function BackButton({ onClick }) {
  return (
    <button className="btn btn-secondary mt-3" onClick={onClick}>
      Back
    </button>
  );
}

function Manual({ onBack }) {
  return (
    <div>
      <div className="flex flex-col gap-3 justify-center items-center">
        <h2 className="text-3xl font-bold">Manual Input</h2>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 shadow-md">
          <label className="label">Select a Name</label>
          <select className="select select-bordered">
            <option disabled selected>
              Pick a name
            </option>
            <option>Yousef</option>
            <option>John</option>
            <option>Jane</option>
          </select>
          <label className="label mt-4">Amount Owed</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Amount owed"
          />
          <label className="label mt-4">Reason</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Reason for transaction"
          />
          <button className="btn btn-neutral mt-4">Add Transaction</button>
        </fieldset>
        <BackButton onClick={onBack} />
      </div>
    </div>
  );
}

function UseTab({ onBack }) {
  const [parsedData, setParsedData] = useState([]);
  const [appOutput, setAppOutput] = useState("");
  const [isParsed, setIsParsed] = useState(false);

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
            <table className="table table-md table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nickname</th>
                  <th>Amount</th>
                  <th>Real Name</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row) => (
                  <tr key={row.id}>
                    <th>{row.id}</th>
                    <td>{row.nickname}</td>
                    <td>${row.amount}</td>
                    <td>
                      <select className="select select-bordered">
                        <option disabled selected>
                          Select Name
                        </option>
                        <option>Yousef</option>
                        <option>John</option>
                        <option>Jane</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <BackButton onClick={onBack} />
      </div>
    </div>
  );
}

function Splitter({ onBack }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Splitter</h2>
      {/* Add content for splitting bills here */}
      <BackButton onClick={onBack} />
    </div>
  );
}
