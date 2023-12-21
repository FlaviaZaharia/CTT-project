import { useState, useEffect } from "react";
import "./edit-skill-modal.scss";
import Select from "react-select";
import { measurement } from "../../constants/constants";
import { useSelector, useDispatch } from "react-redux";
import { updateSkills } from "../../actions/profileActions";
const EditSkillModal = ({ showEditModal, onCloseEditModal, editable }) => {
  const [measure, setMeasure] = useState({
    label: "",
    value: "",
  });
  const dispatch = useDispatch();
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const token = userInfo?.userData?.token;
  const skillsList = userInfo?.profile?.skillsList;
  const handleSave = async (e) => {
    e.preventDefault();
    let skillsIndex = skillsList.findIndex((item) => item.id === editable.id);
    let skills = [
      ...skillsList.slice(0, skillsIndex),
      { ...skillsList[skillsIndex], measure: measure.value },
      ...skillsList.slice(skillsIndex + 1),
    ];
    dispatch(updateSkills(token, skills));
    onCloseEditModal();
  };

  if (!showEditModal) return null;
  return (
    <div className="modal-skills">
      <div className="modal-skills-content">
        <h2>Edit your skill</h2>
        <div className="subtitle-section">
          <h4>
            {editable.domain}, {editable.subDomain}
          </h4>
        </div>
        <div className="experience-section">
          <label>Please choose your experience:</label>
          <div className="exp">
            <Select
              defaultValue={{
                label: editable.measure,
                value: editable.measure,
              }}
              onChange={setMeasure}
              options={measurement}
              className="measurement-dropdown"
            />
          </div>
        </div>

        <div className="button-section">
          <button onClick={onCloseEditModal} className="cancel-button-modal">
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

export default EditSkillModal;
