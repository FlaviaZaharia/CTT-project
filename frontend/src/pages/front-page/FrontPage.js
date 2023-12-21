import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import logo from "../../assets/logo2.png";
import "./front-page.scss";
const FrontPage = () => {
  const user = useSelector((user) => {
    return user.auth;
  });
  const isAuthenticated = user.isAuthenticated;
  return (
    <div className="front-page-container">
      <Header />
      {/* <Link to={isAuthenticated ? "/dashboard" : "/login"}>
        {isAuthenticated ? "Dashboard" : "Login"}
      </Link> */}
      <div className="main-container">
        <div className="wrapper">
          <div className="writing-part">
            <h1>
              Start collaborating
              <br /> on your projects
            </h1>
            <p>Add team members and start your dream projects with CollabZone</p>
          </div>
         <div className="img-div-front"><img src={logo} alt="logo" /></div> 
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
