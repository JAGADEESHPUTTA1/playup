import "./Loader.css"
export default function Loader({ text = "Preparing your console..." }) {
  return (
    <div className="loader_overlay">
      <div className="loader_card">
        <div className="controller">
          🎮
        </div>
        <p className="loader_text">{text}</p>
      </div>
    </div>
  );
}
