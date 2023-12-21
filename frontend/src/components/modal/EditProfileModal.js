import "./edit-profile-modal.scss";
import { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { Countries } from "../../constants/constants";
import profile from "../../assets/user (1).png";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileDetails } from "../../actions/profileActions";
import { minNameLength, nameRegex } from "../../constants/constants";
import { checkValidity } from "../../validate";
import ErrorMessage from "../../components/ErrorMessage";
const EditProfileModal = ({
  show,
  onClose,
  firstName_profile,
  lastName_profile,
  selected_profile,
  pic,
}) => {
  const [firstNameEdit, setFirstNameEdit] = useState(firstName_profile);
  const [lastNameEdit, setLastNameEdit] = useState(lastName_profile);
  const [selected, setSelected] = useState(selected_profile);
  const [image, setImage] = useState(pic);
  const [loading, setLoading] = useState(false);
  const [controls, setControls] = useState({
    firstNameEdit: {
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
    lastNameEdit: {
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
  const dispatch = useDispatch();
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const token = userInfo.userData.token;
  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "wkkyhkkz");
    setLoading(true);
    const response = await fetch(
      " https://api.cloudinary.com/v1_1/djfe4eels/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await response.json();
    console.log(file);
    setImage(
      "https://res.cloudinary.com/djfe4eels/image/upload/" + file.public_id
    );
    setLoading(false);
  };
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
    const isLastNameValid = await validateControl("lastNameEdit", lastNameEdit);
    const isFirstNameValid = await validateControl(
      "firstNameEdit",
      firstNameEdit
    );
    return isLastNameValid && isFirstNameValid;
  };

  const handleSave = async (e) => {
    let location;
    const picUrl = image;
    e.preventDefault();
    Object.entries(Countries).map(([key, value]) => {
      if (key === selected) location = value;
    });
    let resultValid = await validateForm();
    if (!resultValid) return;
    dispatch(
      updateProfileDetails(
        token,
        firstNameEdit,
        lastNameEdit,
        location,
        selected,
        picUrl
      )
    );
    onClose();
  };

  useEffect(() => {
    setFirstNameEdit(firstName_profile);
    setLastNameEdit(lastName_profile);
    setSelected(selected_profile);
    setImage(pic);
    setControls({
      ...controls,
      firstNameEdit: { ...controls.firstNameEdit, valid: true, errorText: "" },
      lastNameEdit: { ...controls.lastNameEdit, valid: true, errorText: "" },
    });
  }, [onClose]);
  if (!show) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="photo-div">
          <label className="custom-file-upload">
            <div className="img-wrap img-upload">
              <img src={image ? image : profile} alt="profile" />
            </div>
            <input type="file" onChange={uploadImage} />
          </label>
        </div>
        {loading && <p>Loading...</p>}
        <h2>Edit your profile</h2>
        <form>
          <div className="name-section">
            <div className="input-field" id="firstName">
              <label>
                First Name<span className="star">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstNameEdit"
                value={firstNameEdit}
                placeholder="Your first name"
                onChange={(e) => setFirstNameEdit(e.target.value)}
              />
              {controls.firstNameEdit.errorText && (
                <ErrorMessage errorMessage={controls.firstNameEdit.errorText} />
              )}
            </div>
            <div className="input-field">
              <label>
                Last Name<span className="star">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastNameEdit"
                value={lastNameEdit}
                placeholder="Your last name"
                onChange={(e) => setLastNameEdit(e.target.value)}
              />
              {controls.lastNameEdit.errorText && (
                <ErrorMessage errorMessage={controls.lastNameEdit.errorText} />
              )}
            </div>
          </div>
          <div className="location-section">
            <ReactFlagsSelect
              selected={selected}
              onSelect={(code) => setSelected(code)}
            />
          </div>
          <div className="button-area">
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button onClick={handleSave} className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
