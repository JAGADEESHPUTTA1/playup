import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar/Navbar";

import Book from "./pages/Book/Book";
import Payments from "./pages/Payments/Payments";
import Success from "./pages/Success/Success";
import Home from "./pages/Home/Home";
import Login from "../src/components/Login/Login";
import MyOrders from "./components/MyOrders/MyOrders";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import EditOrder from "./pages/EditOrder/EditOrder"
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import UserRoute from "./components/ProtectedRoutes/UserRoute";
import AdminRoute from "./components/ProtectedRoutes/AdminRoute";
import RequireOrder from "./components/ProtectedRoutes/RequireOrder";
import RequirePayment from "./components/ProtectedRoutes/RequirePayment";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />

        {/* USER PROTECTED */}
        <Route
          path="/home"
          element={
            <UserRoute>
              <Home />
            </UserRoute>
          }
        />
        <Route
          path="/book"
          element={
            <UserRoute>
              <Book />
            </UserRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <UserRoute>
              <RequireOrder>
                <Payments />
              </RequireOrder>
            </UserRoute>
          }
        />
        <Route
          path="/success"
          element={
            <UserRoute>
              <RequirePayment>

              <Success />
              </RequirePayment>
            </UserRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <UserRoute>
              <MyOrders />
            </UserRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <UserRoute>
              <OrderDetails />
            </UserRoute>
          }
        />

        <Route
          path="/orders/:orderId/edit"
          element={
            <UserRoute>
              <EditOrder />
            </UserRoute>
          }
        />

        {/* ADMIN PROTECTED */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders/:orderId"
          element={
            <AdminRoute>
              <OrderDetails />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders/:orderId/edit"
          element={
            <AdminRoute>
              <EditOrder />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
