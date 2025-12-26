import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 20, borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ fontWeight: "bold", fontSize: 20 }}>
        PLAY UP 🎮
      </Link>
      <Link to="/book" style={{ marginLeft: 20 }}>
        Book Now
      </Link>
    </nav>
  );
}
