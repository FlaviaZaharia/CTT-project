import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import AddMembersModal from "../../components/modal/AddMembersModal";
import ConfirmDelete from "../../components/modal/ConfirmDelete";
import EditProjectDetailsModal from "../../components/modal/EditProjectDetailsModal";
import CreateTaskModal from "../../components/modal/CreateTaskModal";
import axios from "axios";
import { getCurrentProject } from "../../actions/projectActions";
import BoardContainer from "../../components/board/BoardContainer";
import { config } from "../../config";
import { getAllTeam } from "../../actions/projectActions";
import "./project-overview.scss";
import edit from "../../assets/edit.png";
import deleteImg from "../../assets/delete.png";
import addMember from "../../assets/add-user.png";
const ProjectOverview = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const token = userInfo.userData.token;
  const currentProject = userInfo?.currentProject;
  const id = currentProject?._id;
  const team = currentProject?.teamMembers;
  const owner = currentProject?.owner;
  const currentTasks = userInfo?.currentProjectTasks;
  const teamMembers = userInfo?.fullTeam;
  const allTeam = teamMembers.map((t) => {
    return { label: t.label, value: JSON.stringify(t.value) };
  });
  const currentColumns = userInfo?.currentColumns;
  const [show, setShow] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [col, setCol] = useState(
    Object.entries(currentColumns)
      .map(([columnId, column], index) => {
        return column.name;
      })
      .slice(-1)[0] || " "
  );

  const getNrOfActiveTasks = () => {
    const team =
      teamMembers.length > 0 &&
      teamMembers.map((t) => {
        let nrTasks =
          currentTasks.length > 0 &&
          currentTasks.filter(
            (c) => c.assignee === t.value._id && c.status != col
          ).length;
        return { id: t.value._id, nr: nrTasks };
      });
    return team;
  };

  const [nrOfIndividualTasks, setNrOfIndividualTasks] = useState(
    getNrOfActiveTasks()
  );

  // console.log(nrOfIndividualTasks);
  const getAllProjectTasks = () => {
    dispatch(getCurrentProject(id, token));
  };
  useEffect(() => {
    setTimeout(() => {
      getAllProjectTasks();
    }, 1000);
    dispatch(getAllTeam(team, owner));
  }, []);

  useEffect(
    () =>
      setCol(
        Object.entries(currentColumns)
          .map(([columnId, column], index) => {
            return column.name;
          })
          .slice(-1)[0] || " "
      ),
    [currentColumns]
  );
  useEffect(() => {
    setNrOfIndividualTasks(getNrOfActiveTasks());
  }, [currentTasks]);

  const handleOpen = () => {
    setShowTaskModal(true);
    dispatch(getCurrentProject(id, token));
  };
  return (
    <div className="project-overview">
      <div className="project-upper">
        <h2>{currentProject?.projectTitle}</h2>
        <p id="projectDomain">{currentProject?.projectDomain}</p>
        {currentProject?.projectDescription && (
          <p>{currentProject?.projectDescription}</p>
        )}
          <div className="btn-div">
            {currentProject.owner === userInfo.userData._id && 
            <button
              onClick={() => setShowEditProjectModal(true)}
              className="btn first"
            >
              <img src={edit} alt="edit" />
            </button>}
            {currentProject.owner === userInfo.userData._id &&
            <button
              onClick={() => setShowConfirmDeleteModal(true)}
              className="btn"
            >
              <img src={deleteImg} alt="delete" />
            </button>}
            {currentProject.owner === userInfo.userData._id &&
            <button onClick={() => setShow(true)} className="btn">
              <img src={addMember} alt="add" />
            </button>}
            {Object.keys(currentColumns).length !== 0 && (
              <div>
                <button
                  onClick={handleOpen}
                  className="create-task-button"
                >
                  Create Task
                </button>
              </div>
            )}
          </div>
      </div>
      <BoardContainer getTasks={getAllProjectTasks} />
      <AddMembersModal
        show={show}
        onClose={() => setShow(false)}
        project={currentProject}
      />
      <ConfirmDelete
        showConfirmDeleteModal={showConfirmDeleteModal}
        onCloseConfirmDeleteModal={() => setShowConfirmDeleteModal(false)}
        project={currentProject}
        token={token}
      />
      <EditProjectDetailsModal
        showEditProjectModal={showEditProjectModal}
        onCloseEditProjectModal={() => setShowEditProjectModal(false)}
        titlePrj={currentProject?.projectTitle}
        descriptionPrj={currentProject?.projectDescription}
        domainPrj={currentProject?.projectDomain}
        token={token}
        id={currentProject._id}
      />
      <CreateTaskModal
        onCloseTaskModal={() => setShowTaskModal(false)}
        showTaskModal={showTaskModal}
        allTeam={teamMembers}
        nrOfTasks={nrOfIndividualTasks}
      />
    </div>
  );
};

export default ProjectOverview;
