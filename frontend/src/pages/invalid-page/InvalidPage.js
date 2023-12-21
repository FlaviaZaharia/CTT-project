import noToken from "../../assets/icon-noToken.svg";
import { Link } from "react-router-dom";
import "./invalid-page.scss";
const InvalidPage = () => {
  return (
    <section className="invalid-content">
      <h1>Your token has expired</h1>
      <div className="auth-text">
        <p>
          If you still wish to reset your password,
          <br />
          <Link to="/forgot-password" className="auth-link">
            you can make a request here
          </Link>
        </p>
      </div>
      <img src={noToken} alt="noToken" />
    </section>
  );
};

export default InvalidPage;
