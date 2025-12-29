import WhatsappIcon from "../../images/WhatsappIcon";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const rentRedirectHandler = () => {
    navigate("/book");
  };

  const whatsappHandler = () => {
    const phoneNumber = "918328005037";
    const message = `
Hello PlayUp 👋

I’m interested in renting a PlayStation console.Could you please share the available options, pricing, and rental process?

Thank you.
`.trim();

    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.location.href = whatsappUrl;
  };

  return (
    <div className="page">
      <main className="hero">
        <div className="hero-content">
          <h1>
            Play More.
            <br />
            Pay Less.
          </h1>

          <h2>
            Rent PlayStation Consoles
            <br />
            Without Buying
          </h2>

          <p>
            PS4 & PS5 consoles delivered to your doorstep.
            <br />
            No commitment. No heavy spending. Just gaming.
          </p>

          <div className="cta-group">
            <button className="btn-primary" onClick={rentRedirectHandler}>
              Rent Now
            </button>
            <button
              className="btn-whatsapp line_center"
              onClick={whatsappHandler}
            >
              <WhatsappIcon /> {"  "}Whatsapp Us
            </button>
            <button className="btn-secondary">View Plans</button>
          </div>

          <span className="trust">⭐ Trusted by 1,000+ gamers</span>
        </div>
      </main>
    </div>
  );
};

export default Home;
