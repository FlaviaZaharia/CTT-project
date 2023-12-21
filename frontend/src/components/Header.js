import "./header.scss";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
   const navigate=useNavigate();
  const user = useSelector((user) => {
    return user.auth;
  });
  const isAuthenticated=user?.isAuthenticated;
  return (
    <header className="header">
      <h2>CollabZone</h2>
      <ul className="navbar">
        {isAuthenticated&&<li><Link to="/dashboard" className="link">Dashboard</Link></li>}
        {!isAuthenticated&&<button onClick={()=>navigate("/login")}>Sign In</button>}
      </ul>
    </header>
  );
};
export default Header;
