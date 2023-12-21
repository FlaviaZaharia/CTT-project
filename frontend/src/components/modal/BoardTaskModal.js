import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Select from "react-select";
import { difficulties } from "../../constants/constants";
import close from "../../assets/close.png";
import "./board-task-modal.scss";
import { getCurrentProject, getColumns } from "../../actions/projectActions";
import { checkValidity } from "../../validate";
import ErrorMessage from "../ErrorMessage";
import bin from "../../assets/bin.png"
const BoardTaskModal = ({
  onClose,
  show,
  currentTask,
  fullTeam,
  currentColumn,
}) => {
  const {
    priority,
    taskDescription,
    taskTitle,
    status,
    createdBy,
    _id,
    projectId,
    assignee,
  } = currentTask;
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assigneePerson, setAssigneePerson] = useState({
    label: "...",
    value: null,
  });

  const [tStatus, setTStatus] = useState({ label: "", value: "" });
  const [tPriority, setTPriority] = useState({ label: "", value: "" });
  const [isEditable, setIsEditable] = useState(false);
  const [controls, setControls] = useState({
    title: {
      validation: {
        required: {
          errorText: "Please provide a title",
        },
      },
      valid: true,
      errorText: "",
    },
    desc: {
      validation: {
        required: {
          errorText: "Please provide a description",
        },
      },
      valid: true,
      errorText: "",
    },
  });
  const userInfo = useSelector((user) => {
    return user.auth;
  });

  const team = userInfo?.currentProject?.teamMembers;
  let ownerId = userInfo?.currentProject?.owner;
  const prjId = userInfo?.currentProject?._id;
  const currentColumns = userInfo?.currentColumns;
  const token = userInfo?.userData?.token;
  const colArray = Object.entries(currentColumns).map(
    ([columnId, column], index) => {
      return { label: column.name, value: column.name };
    }
  );

  const getUser = async (assignee) => {
    if (userInfo.currentProjectTasks.length > 0) {
      ownerId = assignee;
      axios
        .get(`/api/users/get-user/${ownerId}`)
        .then((res) =>
          setAssigneePerson({ label: res.data.name, value: res.data.userData })
        )
        .catch((error) => {
          console.log(error);
          setAssigneePerson({ label: "Unassigned", value: null });
        });
    }
  };
  const deleteTask = async () => {
    try {
      const { data } = await axios.put(
        `/api/column/delete-task-from-column/${currentColumn}`,
        { _id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log(error);
    }

    try {
      const id = _id;
      const { res } = await axios.delete(`/api/tasks/delete-task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log(error);
    }
    const id = projectId;
    dispatch(getCurrentProject(id, token));
    onClose();
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
    const isTitleValid = await validateControl("title", title);
    const isDescValid = await validateControl("desc", desc);
    return isTitleValid && isDescValid;
  };
  const saveEdits = async () => {
    let resultValid = await validateForm();
    if (!resultValid) return;
    let id = _id;
    const taskTitle = title;
    const taskDescription = desc;
    const assignee = assigneePerson.value._id;
    const status = tStatus.value;
    const priority = tPriority.value;
    const colId = currentColumn;
    const colExchange = true;
    axios
      .put(
        `/api/tasks/update-task/${id}`,
        { taskTitle, taskDescription, assignee, status,
          priority, colExchange },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        getUser(assigneePerson.value._id);
        setIsEditable(false);
      })
      .then(() => {
        id = prjId;
        dispatch(getCurrentProject(id, token));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setTitle(taskTitle);
    setDesc(taskDescription);
    setTStatus({ label: status, value: status });
    setTPriority({ label: priority, value: priority });
    getUser(assignee);
  }, [currentTask]);
  useEffect(() => {
    setIsEditable(false);
    setControls({
      ...controls,
      title: { ...controls.title, valid: true, errorText: "" },
      desc: { ...controls.desc, valid: true, errorText: "" },
    });
  }, [onClose]);

  if (!show) return null;
  return (
    <div className="modal-create-project">
      <div className="modal-task-content">
        <div className="close-div">
          <button onClick={onClose}>
            <img src={close} alt="close" />
          </button>
        </div>
        <div className="content-tsk">
          <div className="input-container">
            {isEditable ? (
              <div className="input-section">
                <div>
                  <input
                    value={title}
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {controls.title.errorText && (
                    <ErrorMessage errorMessage={controls.title.errorText} />
                  )}
                </div>
              </div>
            ) : (
              <div onClick={() => setIsEditable(true)} className="title-task">
                <h2>{title}</h2>
              </div>
            )}
            <p id="created-by">Created by: {createdBy.name}</p>
            {isEditable ? (
              <div className="input-section">
                <div>
                  <textarea
                    value={desc}
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description"
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  {controls.desc.errorText && (
                    <ErrorMessage errorMessage={controls.desc.errorText} />
                  )}
                </div>
              </div>
            ) : (
              <div onClick={() => setIsEditable(true)} className="desc-task">
                <p>{desc}</p>
              </div>
            )}
          </div>
          <div className="dropdown-section">
            <div className="dropdown-group">
              <label>Status</label>
              <Select
                defaultValue={null}
                value={tStatus}
                onChange={setTStatus}
                options={colArray}
                className="dropdown-col"
                // isDisabled={true}
              />
            </div>
            <div className="dropdown-group">
              <label>Priority</label>
              <Select
                defaultValue={null}
                value={tPriority}
                onChange={setTPriority}
                options={difficulties}
                name="priority"
                className="dropdown-col"
              />
            </div>
            <div className="dropdown-group">
              <label>Assignee</label>
              <Select
                //defaultValue={null}
                value={assigneePerson}
                onChange={setAssigneePerson}
                options={fullTeam}
                className="dropdown-col"
              />
            </div>
          </div>
        </div>
        <div className="button-section-board">
          <button className="save-button-modal" onClick={saveEdits}>
            Edit
          </button>
          <button className="delete-button-modal" onClick={deleteTask}><img src={bin} alt="bin"/></button>
        </div>
      </div>
    </div>
  );
};

export default BoardTaskModal;
