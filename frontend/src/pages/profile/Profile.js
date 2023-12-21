import "./profile.scss";
import { Helmet } from "react-helmet";
import { useState } from "react";
import ClockHours from "../../components/profile-content/ClockHours";
import MySkills from "../../components/profile-content/MySkills";
import ProfileInfo from "../../components/profile-content/ProfileInfo";
import Notifications from "../../components/profile-content/Notifications";
import ClockHoursContainer from "../../components/profile-content/ClockHoursContainer";
import "../../components/sidebar/sidebar.scss";
import user from "../../assets/user.png";
import skill from "../../assets/skill.png";
import clock from "../../assets/clock.png";
import notification from "../../assets/notification.png";
import { Link } from "react-router-dom";
const Profile = () => {
  const [activeLink, setActiveLink] = useState(1);
  const getContent = (nr) => {
    switch (nr) {
      case 1:
        return <ProfileInfo />;
      case 2:
        return <MySkills />;
      case 3:
        return <ClockHoursContainer/>;
      default:
        return <ProfileInfo />;
    }
  };
  return (
    <div className="profile-wrapper">
      <Helmet>
        <title>My profile</title>
      </Helmet>
      {/* <Sidebar /> */}
      <aside className="side-bar">
        <h2>My Profile</h2>
        <ul>
          <Link to="/profile" className="link">
            <li
              className={activeLink === 1 ? "li active-li" : "li"}
              onClick={() => {
                setActiveLink(1);
              }}
            >
              <div className="list-item">
                <img src={user} alt="user" />
                <span
                  className={activeLink === 1 ? "text active-text" : "text"}
                >
                  User details
                </span>
              </div>
            </li>
          </Link>
          <Link to="/profile" className="link">
            <li
              className={activeLink === 2 ? "li active-li" : "li"}
              onClick={() => {
                setActiveLink(2);
              }}
            >
              <div className="list-item">
                <img src={skill} alt="skills" />
                <span
                  className={activeLink === 2 ? "text active-text" : "text"}
                >
                  My skills
                </span>
              </div>
            </li>
          </Link>
          <Link to="/profile" className="link">
            <li
              className={activeLink === 3 ? "li active-li" : "li"}
              onClick={() => {
                setActiveLink(3);
              }}
            >
              <div className="list-item">
                <img src={clock} alt="clock" />
                <span
                  className={activeLink === 3 ? "text active-text" : "text"}
                >
                  Clock hours
                </span>
              </div>
            </li>
          </Link>
        </ul>
      </aside>
      {getContent(activeLink)}
    </div>
  );
};

export default Profile;
