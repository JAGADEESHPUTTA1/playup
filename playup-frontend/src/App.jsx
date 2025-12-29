import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";

import Book from "./pages/Book/Book";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Login from "../src/components/Login/Login";
import Admin from "./pages/Admin/Admin";
import MyOrders from "./components/MyOrders/MyOrders";
import OrderDetails from "./components/OrderDetails/OrderDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
