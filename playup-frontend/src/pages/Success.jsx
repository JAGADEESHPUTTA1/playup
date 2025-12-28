import CheckCircleAnimated from "../images/CheckCircle";
import WhatsappIcon from "../images/WhatsappIcon";

export default function Success() {
  const orderId = localStorage.getItem("orderId");
  return (
    <div>
      <div className="center">
        <CheckCircleAnimated size={80} />
      </div>
      <h2 className="center">Payment Successful 🎉</h2>
      <p className="center">Your booking is confirmed.</p>
      <p className="center">Your order id is {orderId}.</p>
      <p className="center">Our team will contact you shortly.</p>
      
      <div className="center">
        <button className="btn-whatsapp line_center" >
        <WhatsappIcon /> Whatsapp Us
      </button> 
      </div>
    </div>
  );
}
