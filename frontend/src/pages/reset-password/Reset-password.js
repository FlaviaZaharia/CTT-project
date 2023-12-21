import axios from "axios";
import { useState, useEffect } from "react";
import { config } from "../../config";
import AuthWrapper from "../auth-wrapper/auth-wrapper";
import resetLogo from "../../assets/icon-reset-password.svg";
import { useNavigate } from "react-router";
import ErrorMessage from "../../components/ErrorMessage";
import { checkValidity } from "../../validate";
import { useParams } from "react-router-dom";
import InvalidPage from "../invalid-page/InvalidPage";
import { PasswordLength, alphaNumeric } from "../../constants/constants";
import "./reset-password.scss";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown1, setPasswordShown1] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [controls, setControls] = useState({
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
  });
  const navigate = useNavigate();
  const resetToken = useParams().resetToken;
  useEffect(() => {
    fetch(`/api/users/reset-password/${resetToken}`)
      .then((res) => res.json())
      .then((data) => {
        setIsValid(data.isValid);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [resetToken, isValid]);

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
    const isPasswordValid = await validateControl("password", password);
    const isConfirmPasswordValid = await validateControl(
      "confirmPassword",
      confirmPassword,
      password
    );
    return isPasswordValid && isConfirmPasswordValid;
  };
  const resetPassword = async (e) => {
    setErrorText("");
    e.preventDefault();
    let resultValid = await validateForm();
    if (!resultValid) return;
    try {
      await axios.post(
        `/api/users/reset-password/${resetToken}`,
        { password },
        config
      );
      navigate("/login");
    } catch (error) {
      setErrorText(error.response.data.error);
    }
  };
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

  if (!isValid) return <InvalidPage />;

  return (
    <AuthWrapper title="Reset Password" logo={resetLogo}>
      <form className="reset-form">
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
            onChange={(e) => setPassword(e.target.value)}
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
            id="confirmPpassword"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {!controls.password.errorText &&
            !controls.confirmPassword.errorText && (
              <ErrorMessage errorMessage={errorText} />
            )}
          <button onClick={resetPassword} type="submit">
            Reset Password
          </button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default ResetPassword;
