import * as actionTypes from "../../actions/types";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CreateProjectModal from "../../components/modal/CreateProjectModal";
import dashboard from "../../assets/dashboard.svg";
import event from "../../assets/event.png";
import manager from "../../assets/manager.png";
import clipboard from "../../assets/clipboard.png";
import "./content-page.scss";
import profile from "../../assets/user (1).png";
import ProjectCard from "../../components/cards/ProjectCard";
import { getAllProjects } from "../../actions/projectActions";
import { Helmet } from "react-helmet";
const ContentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((user) => {
    return user.auth;
  });

  const token = user.userData.token;
  const allProjects = user?.allProjects || [];
  useEffect(() => {
    setTimeout(() => dispatch(getAllProjects(token)), 1000);
  }, []);

  const [show, setShow] = useState(false);
  const handleLogout = () => {
    dispatch({
      type: actionTypes.LOGOUT,
    });
    navigate("/");
  };
  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="dashboard-container">
        <div className="main-sidebar">
          <h1>CollabZone</h1>
          <div className="photo-div-dashboard">
            <label className="custom-file-upload">
              <div className="img-wrap img-upload">
                <img src={user.profile.profilePictureUrl?user.profile.profilePictureUrl:profile} alt="profile" />
              </div>
            </label>
            <p>
              <Link to="/profile" className="link-profile">
                Go to Profile
              </Link>
            </p>
          </div>
          <div className="navigation-dashboard">
            <ul>
              <li>
                <Link to="/dashboard" className="link">
                  <div className="li-container">
                    <img src={manager} alt="plus" />
                    <span>My projects</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="card-container-dashboard">
          <div className="upper-side">
            <button onClick={handleLogout}>Log out</button>
          </div>
          <div className="title-side">
            <img src={dashboard} alt="dashboard" />
            <div className="text-display">
              <h1>
                Welcome, {user.profile.firstName} {user.profile.lastName}!
              </h1>
              <p>Here is an overview of all your projects</p>
              <div className="new-project">
                <button onClick={() => setShow(true)}>New Project</button>
              </div>
            </div>
          </div>
          <div className="project-card-grid-section">
            {allProjects ? (
              <div className="project-card-grid">
                {allProjects &&
                  allProjects.map((project) => {
                    return <ProjectCard key={project._id} project={project} />;
                  })}
              </div>
            ) : (
              <h2>There are no project to display yet.</h2>
            )}
          </div>
        </div>
      </div>
      <CreateProjectModal show={show} onClose={() => setShow(false)} />
    </div>
  );
};

export default ContentPage;
