import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import "./create-task-modal.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { difficulties, assigneeEmail } from "../../constants/constants";
import { getCurrentProject } from "../../actions/projectActions";
import { checkValidity } from "../../validate";
import ErrorMessage from "../../components/ErrorMessage";
const CreateTaskModal = ({
  showTaskModal,
  onCloseTaskModal,
  allTeam,
  nrOfTasks,
}) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [priorityLevel, setPriorityLevel] = useState({
    label: "",
    value: "",
  });
  const [person, setPerson] = useState({
    label: "",
    value: "",
  });

  const [controls, setControls] = useState({
    taskTitle: {
      validation: {
        required: {
          errorText: "Please provide a title",
        },
      },
      valid: true,
      errorText: "",
    },
    taskDescription: {
      validation: {
        required: {
          errorText: "Please provide a description",
        },
      },
      valid: true,
      errorText: "",
    },
    priority: {
      validation: {
        required: {
          errorText: "Please choose a priority level",
        },
      },
      valid: true,
      errorText: "",
    },
    person: {
      validation: {
        required: {
          errorText: "Please choose a person",
        },
      },
      valid: true,
      errorText: "",
    },
  });
  const [err, setErr] = useState({
    name: "",
    isError: false,
  });
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const token = userInfo?.userData?.token;
  const currentProject = userInfo?.currentProject;
  const team = currentProject?.teamMembers;
  const ownerId = currentProject?.owner;
  const projectId = currentProject._id.toString();
  const id = currentProject._id.toString();
  const currentColumns = userInfo?.currentColumns;
  const dispatch = useDispatch();

  const validateControl = async (name, value) => {
    const validationResult = checkValidity(value, controls[name].validation);
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
  const checkIfUserIsAvailable = (id) => {
    const taskNr = nrOfTasks.filter((nr) => nr.id === id);
    return taskNr[0].nr + 1 <= 4;
  };
  const validateForm = async () => {
    const isTaskTitleValid = await validateControl("taskTitle", taskTitle);
    const isTaskDescriptionValid = await validateControl(
      "taskDescription",
      taskDescription
    );
    const isPriorityValid = await validateControl(
      "priority",
      priorityLevel.value
    );
    const isUserAvailable = person.value
      ? checkIfUserIsAvailable(person.value._id)
      : true;
    const v = nrOfTasks
      .filter((t) => t.id != person.value._id && t.nr + 1 <= 4)
      .map((t) => {
        const team = allTeam.filter((a) => a.value._id === t.id);
        return team[0];
      });
      setOptions(v);
    if (!isUserAvailable) {
      setErr((prevState) => {
        return { ...prevState, isError: true, name: person.label };
      });
    } else {
      setErr((prevState) => {
        return { ...prevState, isError: false, name: "" };
      });
    }

    return (
      isTaskTitleValid &&
      isTaskDescriptionValid &&
      isPriorityValid &&
      isUserAvailable
    );
  };
  useEffect(() => {
    setTaskTitle("");
    setTaskDescription("");
    setPerson({ Label: "", value: "" });
    setPriorityLevel({ Label: "", value: "" });
    setControls({
      ...controls,
      taskTitle: { ...controls.taskTitle, valid: true, errorText: "" },
      taskDescription: {
        ...controls.taskDescription,
        valid: true,
        errorText: "",
      },
      priority: { ...controls.priority, valid: true, errorText: "" },
      person: { ...controls.person, valid: true, errorText: "" },
    });
    setErr({
      err: "",
      name: "",
    });
  }, [onCloseTaskModal]);

  const createTask = async (e) => {
    e.preventDefault();
    let resultValid = await validateForm();
    if (!resultValid) return;
    try {
      const priority = priorityLevel.value;
      const assignee = person.value._id;
      const status = Object.entries(currentColumns)[0][1].name;
      const { data } = await axios.post(
        "/api/tasks/create-task",
        {
          taskTitle,
          taskDescription,
          priority,
          assignee,
          projectId,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const colId = Object.entries(currentColumns)[0][0];
      const task = data.task._id;
      try {
        const { res } = await axios.put(
          `/api/column/update-tasks-on-column/${colId}`,
          { task },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.log(error);
      }
      dispatch(getCurrentProject(id, token));
      onCloseTaskModal();
    } catch (error) {
      console.log(error);
    }
  };
  if (!showTaskModal) return null;
  return (
    <div className="modal-create-task">
      <div className="modal-create-task-content">
        <h2>Create a task</h2>
        <div className="title-section">
          <label>Title</label>
          <div>
            <input
              type="text"
              id="taskTitle"
              name="taskTitle"
              value={taskTitle}
              placeholder="Title"
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            {controls.taskTitle.errorText && (
              <ErrorMessage errorMessage={controls.taskTitle.errorText} />
            )}
          </div>
        </div>
        <div className="description-section">
          <label>Description</label>
          <div>
            <textarea
              name="taskDescription"
              value={taskDescription}
              placeholder="Write a description"
              rows="4"
              cols="10"
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            {controls.taskDescription.errorText && (
              <ErrorMessage errorMessage={controls.taskDescription.errorText} />
            )}
          </div>
        </div>
        <div className="domain-section">
          <label>Assignee</label>
          <div className="domain-div">
            <Select
              name="person"
              defaultValue={null}
              onChange={setPerson}
              options={allTeam}
              className="domain-dropdown"
            />
            {/* {controls.person.errorText && (
              <ErrorMessage errorMessage={controls.person.errorText} />
            )} */}
            {err.isError && (
              <div className="error-message">
                <ul>
                {err.name} has 4 active tasks at the moment
                <br />
                Please select one of the following:<br/>
                {options.map((o)=><li>{o.label}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="domain-section">
          <label>Priority</label>
          <div className="domain-div">
            <Select
              name="priority"
              defaultValue={null}
              onChange={setPriorityLevel}
              options={difficulties}
              className="domain-dropdown"
            />
            {controls.priority.errorText && (
              <ErrorMessage errorMessage={controls.priority.errorText} />
            )}
          </div>
        </div>
        <div className="button-section">
          <button onClick={onCloseTaskModal} className="cancel-button-modal">
            Cancel
          </button>
          <button className="save-button-modal" onClick={createTask}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
