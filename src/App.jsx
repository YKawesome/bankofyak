import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import AddBill from "./pages/AddBill/AddBill";
import Home from "./pages/Home/Home";
import PayBalances from "./pages/PayBalances/PayBalances";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-bill" element={<AddBill />} />
        <Route path="/pay-balances" element={<PayBalances />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
