import { Link } from "react-router-dom";
import Teehee from "../../assets/teehee.png";

function Navbar() {
  return (
    <div>
      <div className="navbar bg-secondary text-secondary-content shadow-sm justify-center">
        <Link to="/" className="btn btn-ghost text-xl">
          <img
            className="inline-block h-8 w-8 mr-1"
            src={Teehee}
            alt="Bank of YAK Logo"
          />{" "}
          Bank of YAK{" "}
          <img
            className="inline-block h-8 w-8 ml-1"
            src={Teehee}
            alt="Bank of YAK Logo"
          />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;


