import { useState } from "react";
import Manual from "./Manual";
import UseTab from "./UseTab";
import Splitter from "./Splitter";
import ButtonRow from "../../components/ButtonRow";

function AddBill() {
  const [view, setView] = useState("default");
  const [requeryTrigger, setRequeryTrigger] = useState(0);

  const handleRequery = () => {
    setRequeryTrigger((prev) => prev + 1);
  };

  const renderContent = () => {
    switch (view) {
      case "manual":
        return <Manual onBack={() => setView("default")} requeryTrigger={requeryTrigger} />;
      case "tab":
        return <UseTab onBack={() => setView("default")} requeryTrigger={requeryTrigger} />;
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
          <div className="max-w-lg bg-base-100 p-6 shadow-md rounded-box lg:w-lg md:w-md w-xs">
            {renderContent()}
            {view !== "default" && <ButtonRow onBack={() => setView("default")} onPatronAdded={handleRequery} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBill;