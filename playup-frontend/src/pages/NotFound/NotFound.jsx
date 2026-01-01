import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link to="/" className="notfound-btn">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
