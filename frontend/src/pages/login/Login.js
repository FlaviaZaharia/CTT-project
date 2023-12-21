import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/authActions";
import "./login.scss";
import AuthWrapper from "../auth-wrapper/auth-wrapper";
import loginLogo from "../../assets/icon-login.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import ErrorMessage from "../../components/ErrorMessage";
import { checkValidity } from "../../validate";
const Login = () => {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [userAccount, setUserAccount] = useState({ email: "", password: "" });
  const { email, password } = userAccount;
  const [controls, setControls] = useState({
    email: {
      validation: {
        required: {
          errorText: "Please provide an email",
        },
      },
      valid: true,
      errorText: "",
    },
    password: {
      validation: {
        required: {
          errorText: "Please provide a password",
        },
      },
      valid: true,
      errorText: "",
    },
  });
  const dispatch = useDispatch();
  const user = useSelector((user) => {
    return user.auth;
  });
  const { isAuthenticated, errorText} = user;
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setUserAccount({ ...userAccount, [e.target.name]: e.target.value });
  };

  const validateControl = async (name, value) => {
    const validationResult = checkValidity(value, controls[name].validation);
    setControls((prevState) => {
      return {
        ...prevState,
        [name]: {
          ...controls[name],
          valid: validationResult.valid,
          errorText: validationResult.valid ? "" : validationResult.error,
        },
      };
    });
    return validationResult.valid;
  };
  const validateForm = async () => {
    const isEmailValid=await validateControl("email", email);
    const isPasswordValid=await validateControl("password", password);
    return isEmailValid && isPasswordValid;
  };
  const loginHandler = async (e) => {
    e.preventDefault();
    let resultValid=await validateForm();
    if(!resultValid) return;
    dispatch(login(email, password));
  };
  const togglePassword = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  return (
    <AuthWrapper title="Sign In" logo={loginLogo}>
      <form className="login-form">
        <div className="input-field">
          <label>
            Email<span className="star">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Your email"
            onChange={handleChange}
          />
          {controls.email.errorText && (
            <ErrorMessage errorMessage={controls.email.errorText} />
          )}
        </div>
        <div className="input-field">
          <label>
            Password<span className="star">*</span>
          </label>
          <input
            type={passwordShown ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            placeholder="Your password"
            onChange={handleChange}
          />
          <span
            className={passwordShown ? "fa fa-eye icon" : "fa fa-eye-slash"}
            aria-hidden="true"
            onClick={togglePassword}
          ></span>
          <div className="password-error">
          {controls.password.errorText && (
            <ErrorMessage errorMessage={controls.password.errorText} />
          )}
          </div>
        </div>
        <div className="forgot-password-text">
          <p>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </p>
        </div>
        <div className="auth-button">
          {!controls.email.errorText && !controls.password.errorText && (
            <ErrorMessage errorMessage={errorText} />
          )}
          <button onClick={loginHandler} type="submit">
            Sign In
          </button>
        </div>
        <div className="auth-text">
          <p>
            <Link to="/register" className="auth-link">
              Not a member? Sign up here
            </Link>
          </p>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default Login;
