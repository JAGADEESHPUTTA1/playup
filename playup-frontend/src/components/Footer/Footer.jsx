import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <h4 onClick={() => navigate("/")}>PlayUp</h4>
          <p>
            Rent PlayStation consoles easily.
            <br />
            Play more. Pay less.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/book")}>Rent</button>
          <button onClick={() => navigate("/my-orders")}>My Orders</button>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PlayUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
