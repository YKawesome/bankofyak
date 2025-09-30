import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import AddBill from "./pages/AddBill/AddBill";
import Home from "./pages/Home/Home";
import PayBalances from "./pages/PayBalances/PayBalances";

function App() {
  const [adminMode, setAdminMode] = useState(false);

  const toggleAdminMode = () => setAdminMode((prev) => !prev);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home adminMode={adminMode} />} />
        <Route path="*" element={<Home adminMode={adminMode} />} />
        <Route path="/add-bill" element={<AddBill adminMode={adminMode} />} />
        <Route path="/pay-balances/:name" element={<PayBalances adminMode={adminMode} />} />
      </Routes>

      <Footer adminMode={adminMode} onToggleAdmin={toggleAdminMode} />
    </>
  );
}

export default App;
