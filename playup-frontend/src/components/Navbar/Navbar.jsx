import "./Navbar.css";
import logo from "../../assets/final-logo.png";
import { useAuth } from "../../Context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <header className="header">
        <div className="logo">
          <img
            src={logo}
            alt="logo"
            width={120}
            height={75}
            onClick={() => (window.location.href = "/home")}
          />
        </div>
        <button
          className="login-btn"
          onClick={() => {
            if (!user) window.location.href = "/";
            if(user) {
              logout()
              window.location.href = "/"
            }
          }}
        >
          {!user ? "Login" : "Sign Out"}
        </button>
      </header>
    </nav>
  );
}
