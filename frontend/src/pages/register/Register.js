import { register } from "../../actions/authActions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthWrapper from "../auth-wrapper/auth-wrapper";
import "./register.scss";
import registerLogo from "../../assets/icon-register.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import {
  EmailRegex,
  PasswordLength,
  minNameLength,
  alphaNumeric,
  nameRegex,
} from "../../constants/constants";
import ErrorMessage from "../../components/ErrorMessage";
import { checkValidity } from "../../validate";
const Register = () => {
  const navigate = useNavigate();
  const [userAccount, setUserAccount] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown1, setPasswordShown1] = useState(false);
  const [controls, setControls] = useState({
    email: {
      validation: {
        required: {
          errorText: "Please provide an email",
        },
        emailFormat: {
          pattern: EmailRegex,
          errorText: "Please provide a valid email",
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
        minLength: {
          errorText: `Your password must have minimum ${PasswordLength} characters`,
          length: PasswordLength,
        },
        alphaNumeric: {
          pattern: alphaNumeric,
          errorText: "Your password must contain numbers and letters",
        },
      },
      valid: true,
      errorText: "",
    },
    confirmPassword: {
      validation: {
        required: {
          errorText: "Please provide a password",
        },
        matching: {
          errorText: "Passwords do not match",
        },
      },
      valid: true,
      errorText: "",
    },
    firstName: {
      validation: {
        required: {
          errorText: "Please provide your first name",
        },
        minLength: {
          length: minNameLength,
          errorText: `First name must contain minimum ${minNameLength} letters`,
        },
        noNumbers: {
          pattern: nameRegex,
          errorText: "First name cannot contain numbers",
        },
      },
      valid: true,
      errorText: "",
    },
    lastName: {
      validation: {
        required: {
          errorText: "Please provide your last name",
        },
        minLength: {
          length: minNameLength,
          errorText: "Last name must contain minimum 2 letters",
        },
        noNumbers: {
          pattern: nameRegex,
          errorText: "Last name cannot contain numbers",
        },
      },
      valid: true,
      errorText: "",
    },
  });
  const { email, password, confirmPassword, firstName, lastName } = userAccount;
  const dispatch = useDispatch();
  const user = useSelector((user) => {
    return user.auth;
  });
  const { isAuthenticated, errorText } = user;
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const togglePassword = (e, passwordInput) => {
    e.preventDefault();
    switch (passwordInput) {
      case "password":
        setPasswordShown(!passwordShown);
        break;
      case "confirmPassword":
        setPasswordShown1(!passwordShown1);
        break;
      default:
        break;
    }
  };
  const onChange = (e) => {
    setUserAccount((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const validateControl = async (name, value, matchingText) => {
    const validationResult = checkValidity(
      value,
      controls[name].validation,
      matchingText
    );
    setControls((prevState) => {
      return {
        ...prevState,
        [name]: {
          ...prevState[name],
          valid: validationResult.valid,
          errorText: validationResult.valid ? "" : validationResult.error,
        },
      };
    });
    return validationResult.valid;
  };

  const validateForm = async () => {
    const isLastNameValid = await validateControl("lastName", lastName);
    const isFirstNameValid = await validateControl("firstName", firstName);
    const isEmailValid = await validateControl("email", email);
    const isPassowordValid = await validateControl("password", password);
    const isConfirmPasswordValid = await validateControl(
      "confirmPassword",
      confirmPassword,
      password
    );
    return (
      isLastNameValid &&
      isFirstNameValid &&
      isEmailValid &&
      isPassowordValid &&
      isConfirmPasswordValid
    );
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    let resultValid = await validateForm();
    if (!resultValid) return;
    dispatch(register(firstName, lastName, email, password));
  };
  return (
    <AuthWrapper title="Sign Up" logo={registerLogo}>
      <form className="register-form">
        <div className="input-field">
          <label>
            First Name<span className="star">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            placeholder="Your first name"
            onChange={onChange}
          />
          {controls.firstName.errorText && (
            <ErrorMessage errorMessage={controls.firstName.errorText} />
          )}
        </div>
        <div className="input-field">
          <label>
            Last Name<span className="star">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            placeholder="Your last name"
            onChange={onChange}
          />
          {controls.lastName.errorText && (
            <ErrorMessage errorMessage={controls.lastName.errorText} />
          )}
        </div>
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
            onChange={onChange}
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
            onChange={onChange}
          />
          <span
            className={passwordShown ? "fa fa-eye icon" : "fa fa-eye-slash"}
            aria-hidden="true"
            onClick={(e) => togglePassword(e, "password")}
          ></span>
          <div className="password-error">
            {controls.password.errorText && (
              <ErrorMessage errorMessage={controls.password.errorText} />
            )}
          </div>
        </div>
        <div className="requirements">
          <p>Your password must contain:</p>
          <ul>
            <li>Minimum 6 characters</li>
            <li>Both numbers and letters</li>
          </ul>
        </div>
        <div className="input-field">
          <label>
            Confirm Password<span className="star">*</span>
          </label>
          <input
            type={passwordShown1 ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Your password"
            onChange={onChange}
          />
          <span
            className={passwordShown1 ? "fa fa-eye icon" : "fa fa-eye-slash"}
            aria-hidden="true"
            onClick={(e) => togglePassword(e, "confirmPassword")}
          ></span>
          <div className="password-error">
            {controls.confirmPassword.errorText && (
              <ErrorMessage errorMessage={controls.confirmPassword.errorText} />
            )}
          </div>
        </div>
        <div className="auth-button">
          {!controls.email.errorText &&
            !controls.password.errorText &&
            !controls.confirmPassword.errorText &&
            !controls.firstName.errorText &&
            !controls.lastName.errorText && (
              <ErrorMessage errorMessage={errorText} />
            )}
          <button onClick={registerHandler} type="submit">
            Sign Up
          </button>
        </div>
        <div className="auth-text">
          <p>
            <Link to="/login" className="auth-link">
              Already a member? Sign in here
            </Link>
          </p>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default Register;
