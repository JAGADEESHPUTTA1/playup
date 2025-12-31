import "./Navbar.css";
import logo from "../../assets/final-logo.png";
import logoutImg from "../../assets/logout.png";
import { useAuth } from "../../Context/AuthContext";
import HamburgerMenu from "../Hamburger/Hamburger";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const logoHandler = () => {
    if (!token) {
      navigate("/");
    } else if (user.role === "user") {
      navigate("/home");
    } else if (user.role === "admin") {
      navigate("/admin");
    }
  };
  return (
    <nav>
      <header className="header">
        <div className="logo">
          <img
            src={logo}
            alt="logo"
            width={120}
            height={75}
            onClick={logoHandler}
          />
        </div>

        <HamburgerMenu />
      </header>
    </nav>
  );
}
