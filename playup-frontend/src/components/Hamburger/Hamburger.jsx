import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Hambergur.css";
import { useAuth } from "../../Context/AuthContext";

export default function HamburgerMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const logoutHandler = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const myOrderHandler = () => {
    setOpen(false);
    navigate("/my-orders");
  };

  const adminOrderHandler = () => {
    setOpen(false);
    navigate("/admin/orders");
  };

  return (
    <>
      {/* ✅ Hamburger Icon (HIDDEN when open) */}
      {!open && (
        <div className="hamburger" onClick={() => setOpen(true)}>
          <span />
          <span />
          <span />
        </div>
      )}

      {/* Overlay */}
      {open && <div className="menu-overlay" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <div className={`menu-drawer ${open ? "open" : ""}`}>
        {/* Optional close button (recommended UX) */}
        <button className="close-btn" onClick={() => setOpen(false)}>
          ✕
        </button>

        <h3 className="menu-title">Menu</h3>

        {user.role === "user" && (
          <button onClick={myOrderHandler}>My Orders</button>
        )}

        {user.role === "admin" && (
          <button onClick={adminOrderHandler}>All Orders</button>
        )}

        <button className="logout-btn" onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </>
  );
}
