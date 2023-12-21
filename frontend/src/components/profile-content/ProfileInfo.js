import "./profile-info.scss";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import profile from "../../assets/user (1).png";
import map from "../../assets/map.png";
import EditProfileModal from "../modal/EditProfileModal";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const ProfileInfo = () => {
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const navigate=useNavigate();
  const {
    firstName,
    lastName,
    profilePictureUrl,
    teamsList,
    projectList,
    location,
    selected,
  } = userInfo.profile;
  const token = userInfo.userData.token;
  const getProjects=async()=>{
      axios.get("/api/project/get-projects",{
        headers: { Authorization: `Bearer ${token}` },
      }).then(res=>setProj(res.data.projects)).catch(error=>console.log(error))
  }

  useEffect(()=>getProjects(),[])
  const picture = profilePictureUrl;
  const [show, setShow] = useState(false);
  const [proj,setProj]=useState([]);
  const userName = firstName + " " + lastName;
  return (
    <main className="profile-details-wrapper">
      <section className="profile-info-wrapper">
        <div className="photo-name-div">
          <div className="photo-div">
            <label className="custom-file-upload">
              <div className="img-wrap img-upload">
                <img src={picture ? picture : profile} alt="profile" />
              </div>
            </label>
          </div>
          <h3>{userName}</h3>
          <div className="location-div">
            <img src={map} alt="map" />
            <p>{location ? location : "No Location Set"}</p>
          </div>
        </div>
        <section className="project-section">
          <h4>You are part of the following projects:</h4>
          <div className="project-list">
           {proj.length===0&&<p>There are no projects to be displayed yet.</p>}
            {proj&&proj.map((p,index)=><button key={index} onClick={()=>navigate(`/project/${p._id}`)}>{p.projectTitle}</button>)}
          </div>
        </section>
        <button className="edit-button" onClick={() => setShow(true)}>
          Edit profile
        </button>
      </section>

      <EditProfileModal
        selected_profile={selected}
        firstName_profile={firstName}
        lastName_profile={lastName}
        onClose={() => setShow(false)}
        show={show}
        pic={picture}
      />
    </main>
  );
};

export default ProfileInfo;
