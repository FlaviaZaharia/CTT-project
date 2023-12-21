import { useState, useEffect } from "react";
import { updateTeam } from "../../actions/projectActions";
import { useDispatch, useSelector } from "react-redux";
import { EmailRegex } from "../../constants/constants";
import ErrorMessage from "../../components/ErrorMessage";
import { checkValidity, checkInput } from "../../validate";
const AddMembersModal = ({ show, onClose, project }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ email1: "", email2: "", email3: "" });
  const [controls, setControls] = useState({
    email1: {
      validation: {
        emailValid: {
          pattern: EmailRegex,
          errorText: "Please provide a valid email",
        },
      },
      valid: true,
      errorText: "",
    },
    email2: {
      validation: {
        emailValid: {
          pattern: EmailRegex,
          errorText: "Please provide a valid email",
        },
      },
      valid: true,
      errorText: "",
    },
    email3: {
      validation: {
        emailValid: {
          pattern: EmailRegex,
          errorText: "Please provide a valid email",
        },
      },
      valid: true,
      errorText: "",
    },
    email: {
      validation: {
        minimumOne: {
          errorText: "Please provide at least one email",
        },
        emailFormat: {
          pattern: EmailRegex,
          errorText: "Please provide valid emails",
        },
      },
      valid: true,
      errorText: "",
    },
  });
  const { email1, email2, email3 } = email;
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const token = userInfo.userData.token;
  let team = project.teamMembers;
  const handleChange = (e) => {
    setEmail((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const validateControl = async (name, value, matchingText) => {
    const validationResult = checkValidity(
      value,
      controls[name].validation,
      matchingText
    );
    console.log(validationResult);
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

  const validateEmailGroup = async (email1, email2, email3) => {
    const validationResult = checkInput(
      email1,
      email2,
      email3,
      controls.email.validation
    );

    setControls((prevState) => {
      return {
        ...prevState,
        email: {
          ...prevState.email,
          valid: validationResult.valid,
          errorText: validationResult.valid ? "" : validationResult.error,
        },
      };
    });
    return validationResult.valid;
  };

  const validateForm = async () => {
    const isMinimumOneEmail =await validateEmailGroup(
      email1,
      email2,
      email3,
      controls.email.validation
    );
    const isEmail1Valid = await validateControl("email1", email1);
    const isEmail2Valid = await validateControl("email2", email2);
    const isEmail3Valid = await validateControl("email3", email3);

    return isMinimumOneEmail&&isEmail1Valid&&isEmail2Valid&&isEmail3Valid;
  };

  
  const updateTeamMembers = async (e) => {
    e.preventDefault();
    let resultValid = await validateForm();
    console.log(controls);
    if (!resultValid) return;
    if (email1) team = [...team, { email: email1 }];
    if (email2) team = [...team, { email: email2 }];
    if (email3) team = [...team, { email: email3 }];
    dispatch(updateTeam(project._id, team, token));
    onClose();
  };
  useEffect(() => {
    setEmail({ email1: "", email2: "", email3: "" });
    setControls({
      ...controls,
      email: { ...controls.email, valid: true, errorText: "" },
      email1: { ...controls.email1, valid: true, errorText: "" },
      email2: { ...controls.email2, valid: true, errorText: "" },
      email3: { ...controls.email3, valid: true, errorText: "" }
    });
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="modal-create-project">
      <div className="modal-create-project-content">
        <h2>Add team members</h2>
        <div className="title-section">
          <div>
            <input
              type="text"
              id="email1"
              name="email1"
              value={email1}
              placeholder="email@email.com"
              onChange={handleChange}
            />
            {controls.email1.errorText && (
              <ErrorMessage errorMessage={controls.email1.errorText} />
            )}
          </div>
        </div>
        <div className="title-section">
          <div>
            <input
              type="text"
              id="email2"
              name="email2"
              value={email2}
              placeholder="email@email.com"
              onChange={handleChange}
            />
            {controls.email2.errorText && (
              <ErrorMessage errorMessage={controls.email2.errorText} />
            )}
          </div>
        </div>
        <div className="title-section">
          <div>
            <input
              type="text"
              id="email3"
              name="email3"
              value={email3}
              placeholder="email@email.com"
              onChange={handleChange}
            />
            {controls.email3.errorText && (
              <ErrorMessage errorMessage={controls.email3.errorText} />
            )}
          </div>
        </div>
        {controls.email.errorText && (
          <ErrorMessage errorMessage={controls.email.errorText} />
        )}
        <div className="button-section">
          <button className="cancel-button-modal" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button-modal" onClick={updateTeamMembers}>
            Add members
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
