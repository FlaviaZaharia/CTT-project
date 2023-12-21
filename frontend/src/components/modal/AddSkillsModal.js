import "./add-skills-modal.scss";
import { v4 as uuidv4 } from "uuid";
import "react-dropdown/style.css";
import {
  jobOptions,
  measurement,
  chooseOptions,
} from "../../constants/constants";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { useState, useEffect } from "react";
import { updateSkills } from "../../actions/profileActions";
import { checkValidity } from "../../validate";
import ErrorMessage from "../../components/ErrorMessage";
const AddSkillsModal = ({ show, onClose }) => {
  const [domain, setDomain] = useState({ Label: "", value: "" });
  const [subDomain, setSubDomain] = useState({ Label: "", value: "" });
  const [measure, setMeasure] = useState({ Label: "", value: "" });
  const [options, setOptions] = useState([]);
  const [controls, setControls] = useState({
    domain: {
      validation: {
        required: {
          errorText: "Please provide a domain",
        },
      },
      valid: true,
      errorText: "",
    },
    subDomain: {
      validation: {
        required: {
          errorText: "Please provide a subdomain",
        },
      },
      valid: true,
      errorText: "",
    },
    measure: {
      validation: {
        required: {
          errorText: "Please provide your experience level",
        },
      },
      valid: true,
      errorText: "",
    },
  });
  const dispatch = useDispatch();
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const token = userInfo.userData.token;
  let skills = userInfo.profile.skillsList;

  const validateControl = async (name, value) => {
    const validationResult = checkValidity(value, controls[name].validation);
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
  const validateForm = async () => {
    const isDomainValid = await validateControl("domain", domain.value);
    const isSubDomainValid = await validateControl(
      "subDomain",
      subDomain.value
    );
    const isMeasureValid = await validateControl("measure", measure.value);
    return isDomainValid && isSubDomainValid && isMeasureValid;
  };
  const handleSave = async (e) => {
    e.preventDefault();
    let resultValid = await validateForm();
    if (!resultValid) return;
    let newSkill = {
      domain: domain.value,
      subDomain: subDomain.value,
      measure: measure.value,
      id: uuidv4(),
    };
    skills.push(newSkill);
    // skills=[]
    dispatch(updateSkills(token, skills));
    onClose();
  };

  useEffect(() => {
    setDomain({ Label: "", value: "" });
    setSubDomain({ Label: "", value: "" });
    setMeasure({ Label: "", value: "" });
    setControls({
      ...controls,
      domain: { ...controls.domain, valid: true, errorText: "" },
      subDomain: { ...controls.subDomain, valid: true, errorText: "" },
      measure: { ...controls.measure, valid: true, errorText: "" },
    });
  }, [onClose]);
  useEffect(() => {
    let subd={Label:"",value:""};
    setSubDomain(subd);
    setOptions(chooseOptions(domain.value));
  }, [domain]);
  if (!show) return null;

  return (
    <div className="modal-skills">
      <div className="modal-skills-content">
        <h2>Add a new skill</h2>
        <div className="domain-section">
          <label>Please choose a domain:</label>
          <div className="domain-div">
            <Select
              defaultValue={null}
              onChange={setDomain}
              options={jobOptions}
              className="domain-dropdown"
            />
            {controls.domain.errorText && (
              <ErrorMessage errorMessage={controls.domain.errorText} />
            )}
          </div>
        </div>
        <div className="sub-domain-section">
          <label>Please choose a subdomain:</label>
          <div className="sub-domain-div">
            <Select
              defaultValue={null}
              placeholder="Select..."
              value={subDomain}
              onChange={setSubDomain}
              options={options}
              className="sub-domain-dropdown"
            />
            {controls.subDomain.errorText && (
              <ErrorMessage errorMessage={controls.subDomain.errorText} />
            )}
          </div>
        </div>
        <div className="experience-section">
          <label>Please choose your experience:</label>
          <div className="exp">
            <Select
              defaultValue={null}
              onChange={setMeasure}
              options={measurement}
              className="measurement-dropdown"
            />
            {controls.measure.errorText && (
              <ErrorMessage errorMessage={controls.measure.errorText} />
            )}
          </div>
        </div>

        <div className="button-section">
          <button onClick={onClose} className="cancel-button-modal">
            Cancel
          </button>
          <button onClick={handleSave} className="save-button-modal">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkillsModal;
