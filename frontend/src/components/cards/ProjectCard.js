import { useDispatch, useSelector } from "react-redux";
import "./project-card.scss";
import clipboard from "../../assets/clipboard.png";
import { getProjectDetails } from "../../actions/projectActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const ProjectCard = ({ project }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleProjectDetails = () => {
    dispatch(getProjectDetails(project));
    navigate(`/project/${_id}`);
  };
  const { projectTitle, _id } = project;
  const user = useSelector((user) => {
    return user.auth;
  });
  const token = user.userData.token;
  const cols = user?.currentColumns;
  const [tasks, setTasks] = useState([]);
  const [col, setCol] = useState([]);

  const getTasksAndColumns = async () => {
    const id = _id;
    axios
      .get(`/api/tasks/get-user-projects-tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data.tasks))
      .then(() => {
        axios
          .get(`/api/column/get-columns/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            return Object.entries(res.data);
          })
          .then((res) =>
            res.map(([columnId, column], index) => {
              return column.name;
            })
          )
          .then((res) => setCol(res));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getTasksAndColumns();
  }, []);

  const getActiveTasks = () => {
    const activeTasks = tasks.filter(
      (task) => task.status !== col.slice(-1)[0]
    );
    return activeTasks.length;
  };
  const getSolvedTasks = () => {
    const solvedTasks = tasks.filter(
      (task) => task.status === col.slice(-1)[0]
    );
    return solvedTasks.length;
  };

  return (
    <div className="card-container-project">
      <h3>{projectTitle}</h3>
      <div className="tag">
        <span id={project.owner === user.userData._id ? "manager" : "team"}>
          {project.owner === user.userData._id
            ? "Managed by you"
            : "Team member"}
        </span>
      </div>
      <div className="tasks-counter">
        <div className="tasks-traker">
          <div className="tasks-nr">{getActiveTasks()}</div>
          <div className="tasks-status">active</div>
        </div>
        <div className="tasks-traker">
          <div className="tasks-nr">{getSolvedTasks()}</div>
          <div className="tasks-status">solved</div>
        </div>
        <div className="tasks-div-section">
          <img src={clipboard} alt="clipboard" />
          <div className="tasks-status">tasks</div>
        </div>
      </div>
      <div className="card-button-section">
        <button
          onClick={handleProjectDetails}
          id={
            project.owner === user.userData._id
              ? "manager-button"
              : "team-button"
          }
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
