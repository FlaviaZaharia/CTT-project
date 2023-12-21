import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProject } from "../../actions/projectActions";

const ConfirmDelete = ({
  showConfirmDeleteModal,
  onCloseConfirmDeleteModal,
  project,
  token,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDelete = () => {
    dispatch(deleteProject(project._id, token));
    
    onCloseConfirmDeleteModal();
    navigate("/dashboard");
  };
  if (!showConfirmDeleteModal) return null;
  return (
    <div className="modal-create-project">
      <div className="modal-create-project-content">
        <h2>Are you sure?</h2>
        <p>
          If you delete {project.projectTitle} all data associated with it will
          be lost
        </p>
        <div className="button-section">
          <button
            className="cancel-button-modal"
            onClick={onCloseConfirmDeleteModal}
          >
            Cancel
          </button>
          <button className="save-button-modal" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
