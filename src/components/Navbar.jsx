import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    }
  };

  const handleForward = () => {
    navigate(1);
  };

  return (
    <div className="nav">
      <div className="Arrows">
        <div className="arrow" onClick={handleBack}>
          <img src="/assets/ArrowLeft.svg" alt="left" />
        </div>
        <div className="arrow" onClick={handleForward}>
          <img src="/assets/ArrowRight.svg" alt="right" />
        </div>
      </div>
      <div className="account">
        {/* You can replace this with useful navigation like Explore, Library, etc. */}
      </div>
    </div>
  );
};

export default Navbar;
