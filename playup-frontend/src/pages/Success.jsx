import CheckCircleAnimated from "../images/CheckCircle";
import "./styles.css"

export default function Success() {
  return (
    <div>
    <div className="center">
      <CheckCircleAnimated size={80} />
    </div>
       <h2 className="center">
        Payment Successful 🎉
       
      </h2>
      <p className="center">Your booking is confirmed.</p>
      <p className="center">Our team will contact you shortly.</p>
     
    </div>
  );
}
