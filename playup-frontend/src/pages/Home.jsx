import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Play Up 🎮</h1>
      <p>Premium PS4 & PS5 Console Rentals</p>

      <h3>Pricing</h3>
      <ul>
        <li>PS4 – ₹500 / day</li>
        <li>PS5 – ₹800 / day</li>
      </ul>

      <Link to="/book">
        <button>Book a Console</button>
      </Link>
    </div>
  );
}
