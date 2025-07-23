import { Link } from "react-router-dom";
import Favicon from "../../../public/favicon.png";

function Navbar() {
  return (
    <div>
      <div className="navbar bg-secondary text-secondary-content shadow-sm justify-center">
        <Link to="/" className="btn btn-ghost text-xl">
          <img
            className="inline-block h-8 w-8 mr-1"
            src={Favicon}
            alt="Bank of YAK Logo"
          />{" "}
          Bank of YAK{" "}
          <img
            className="inline-block h-8 w-8 ml-1"
            src={Favicon}
            alt="Bank of YAK Logo"
          />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;


