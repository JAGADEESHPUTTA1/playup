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

I’m interested in renting a PlayStation console.
Could you please share the available options, pricing, and rental process?

Thank you.
`.trim();

    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="page">
      {/* HERO */}
      <main className="hero">
        <div className="container">
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

              <button className="btn-whatsapp" onClick={whatsappHandler}>
                <WhatsappIcon /> WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ABOUT */}
      <section className="section about">
        <div className="container">
          <h3>What is PlayUp?</h3>
          <p>
            PlayUp is a PlayStation console rental service that lets you enjoy
            premium gaming without spending ₹50,000+ on buying a console.
          </p>
          <p>
            Choose a console, select your rental duration, and we take care of
            delivery and pickup.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-it-works">
        <div className="container">
          <h3>How It Works</h3>

          <div className="steps">
            <div className="step">
              <span>1</span>
              <p>Select PS4 or PS5</p>
            </div>

            <div className="step">
              <span>2</span>
              <p>Book via App or WhatsApp</p>
            </div>

            <div className="step">
              <span>3</span>
              <p>Delivered & picked up at your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PLAYUP */}
      <section className="section why-playup">
        <div className="container">
          <h3>Why Choose PlayUp?</h3>

          <ul>
            <li>🎮 No expensive console purchase</li>
            <li>💸 Affordable daily & weekly rentals</li>
            <li>🚚 Doorstep delivery & pickup</li>
            <li>🔒 Safe & well-maintained consoles</li>
          </ul>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="section whatsapp-cta">
        <div className="container">
          <h3>Need help or custom rental?</h3>
          <p>
            Chat with us on WhatsApp for instant support, availability,
            and special requests.
          </p>

          <button className="btn-whatsapp large" onClick={whatsappHandler}>
            <WhatsappIcon /> Chat on WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
