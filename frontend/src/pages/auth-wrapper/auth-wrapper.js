import { Helmet } from "react-helmet";
import "./auth-wrapper.scss"
const AuthWrapper = ( props ) => {
  const { title, logo, children } = props;
  return (
    <div className="auth-container">
      <Helmet>
        <title>{title}</title>
        <script src="https://use.fontawesome.com/6a7d581b92.js"></script>
      </Helmet>
      <section className="auth-art-space">
        <h1>{title}</h1>
        <img src={logo} alt="logo" />
      </section>
      <section className="auth-form-container">
        <div className="auth-form-parent">{children}</div>
      </section>
    </div>
  );
};

export default AuthWrapper;
