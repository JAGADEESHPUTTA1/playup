import { Link } from "react-router-dom";

export default function ConsoleCard({ title, price, img, popular }) {
  return (
    <div className={`card ${popular ? "popular" : ""}`}>
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p>₹{price} / day</p>
      <Link to="/book" className="btn-primary">Book Now</Link>
    </div>
  );
}
