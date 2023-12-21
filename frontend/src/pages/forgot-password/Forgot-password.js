import axios from "axios";
import { useState } from "react";
import { config } from "../../config";
import AuthWrapper from "../auth-wrapper/auth-wrapper";
import forgotPasswordLogo from "../../assets/icon-forgot-password.svg";
import "./forgot-password.scss";
import { useNavigate } from "react-router";
import ErrorMessage from "../../components/ErrorMessage";
import { checkValidity } from "../../validate";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
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
  });
  const [message, setMessage] = useState({
    error: "",
    sendMailSuccess: "",
  });
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
    return isEmailValid;
  };

  const requestPasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ error: "", message: "" });
    let resultValid = await validateForm();
    if (!resultValid) return;
    try {
      await axios.post("/api/users/forgot-password", { email }, config);
      setMessage((prevState) => {
        return {
          ...prevState,
          sendMailSuccess:
            "Please check your email to complete your reset password request",
          error: "",
        };
      });
    } catch (error) {
      setMessage((prevState) => {
        return {
          ...prevState,
          error: error.response.data.error,
          sendMailSuccess: "",
        };
      });
    }
  };

  return (
    <AuthWrapper title="Forgot Password" logo={forgotPasswordLogo}>
      <form className="forgot-password-form">
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
            onChange={(e) => setEmail(e.target.value)}
          />
          {controls.email.errorText && (
            <ErrorMessage errorMessage={controls.email.errorText} />
          )}
        </div>
        <div className="auth-button">
          {!controls.email.errorText && message.error && (
            <ErrorMessage errorMessage={message.error} />
          )}
          {message.sendMailSuccess ? (
            <p className="send-email-success">{message.sendMailSuccess}</p>
          ) : (
            <button onClick={requestPasswordChange} type="submit">
              Send Email
            </button>
          )}
        </div>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPassword;
