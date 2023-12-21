import "./sidebar.scss";
import user from "../../assets/user.png";
import skill from "../../assets/skill.png";
import clock from "../../assets/clock.png";
import notification from "../../assets/notification.png";
import { useState } from "react";
import {Link} from "react-router-dom"
const Sidebar = ({activeLink,activate}) => {

  const [active,setActive]=useState(1);
  return (
    <aside className="side-bar">
      <h2>My Profile</h2>
      <ul>
        <Link to="/profile" className="link">
        <li className={active===1?"li active-li":"li"} onClick={()=>{setActive(1)}}>
          <div className="list-item">
            <img src={user} alt="user" />
            <span className={active===1?"text active-text":"text"}>User details</span>
          </div>
        </li>
        </Link>
        <Link to="/profile" className="link">
        <li className={active===2?"li active-li":"li"} onClick={()=>{setActive(2)}}>
          <div className="list-item">
            <img src={skill} alt="skills" />
            <span className={active===2?"text active-text":"text"}>My skills</span>
          </div>
        </li>
        </Link>
        <Link to="/profile" className="link">
        <li className={active===3?"li active-li":"li"} onClick={()=>{setActive(3)}}>
          <div className="list-item">
            <img src={clock} alt="clock" />
            <span className={active===3?"text active-text":"text"}>Clock hours</span>
          </div>
        </li>
        </Link>
        <Link to="/profile" className="link">
        <li className={active===4?"li active-li":"li"} onClick={()=>{setActive(4)}}>
          <div className="list-item">
            <img src={notification} alt="notification" />
            <span className={active===4?"text active-text":"text"}>Notifications</span>
          </div>
        </li>
        </Link>
      </ul>
    </aside>
  );
};

export default Sidebar;
