import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Book from "./pages/Book";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Home from "./Pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}
