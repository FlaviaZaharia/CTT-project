import AddSkillsModal from "../modal/AddSkillsModal";
import EditSkillModal from "../modal/EditSkillModal";
import { useState, useEffect } from "react";
import profile from "../../assets/user (1).png";
import { useDispatch,useSelector } from "react-redux";
import "./my-skills.scss";
import Chart from "react-apexcharts";
import Pagination from "../pagination/Pagination";
import SkillsListItem from "../skill-list-item/SkillsListItem";
import { updateSkills } from "../../actions/profileActions";
import { Helmet } from "react-helmet";
const MySkills = () => {
  const dispatch=useDispatch();
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const token=userInfo?.userData?.token;
  const profilePic = userInfo?.profile?.profilePictureUrl;
  const skillsList = userInfo?.profile?.skillsList;
  //const skills = skillsList.map((x) => x.subDomain);
  // const exp = skillsList.map((x) => parseInt(x.exp));
  const exp1 = skillsList?skillsList.filter((x) => x.measure === "advanced"):[];
  const exp2 = skillsList?skillsList.filter((x) => x.measure === "familiar"):[];
  const exp3 = skillsList?skillsList.filter((x) => x.measure === "intermediate"):[];
  const exp4 = skillsList?skillsList.filter((x) => x.measure === "proficient"):[];
  const exp =[
    (100 * exp2.length) / skillsList.length,
    (100 * exp3.length) / skillsList.length,
    (100 * exp1.length) / skillsList.length,
    (100 * exp4.length) / skillsList.length,
  ];
  const [show, setShow] = useState(false);
  const [showEditModal,setShowEditModal]=useState(false);
  const [series, setSeries] = useState(exp);
  const [editable,setEditable]=useState(null);
  const [options, setOptions] = useState({
    labels: ["familiar", "intermediate", "advanced", "proficient"],
    dataLabels: {
      enabled: true,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: true,
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
  });
  useEffect(() => {
    setOptions({
      labels: ["familiar", "intermediate", "advanced", "proficient"],
    });
    setSeries(exp);
  }, [skillsList]);

  const removeItem=async(id)=>{
    let skills=skillsList.filter((s)=>s.id!==id)
    dispatch(updateSkills(token,skills));
  }

  const openEditModal=(domain,subDomain,measure,id)=>{
    setEditable({domain,subDomain,measure,id})
    setShowEditModal(true);
  }

  return (
    <main className="profile-details-wrapper">
      <Helmet>
        <title>My Skills</title>
      </Helmet>
      <section className="profile-info-wrapper-skills">
        <div className="upper-side">
          <div className="photo-div">
            <label className="custom-file-upload">
              <div className="img-wrap img-upload">
                <img src={profilePic ? profilePic : profile} alt="profile" />
              </div>
            </label>
            <button className="open-modal" onClick={() => setShow(true)}>
              Add skill
            </button>
          </div>
          <div className="title-div">
            <div>
              <h1>My skills</h1>
            </div>
          </div>
        </div>
        <div className="lower-side">
          <div className="card-container">
            <div className="all-skills">
              <h2>Manage skills</h2>
              {skillsList ? (
                <Pagination
                  data={skillsList}
                  title="skills"
                  SkillsList={SkillsListItem}
                  pageLimit={5}
                  dataLimit={3}
                  removeItem={removeItem}
                  openEditModal={openEditModal}
                  editable={editable}
                />
              ) : (
                <p>There are no skills yet</p>
              )}
            </div>
            <div className="card">
              <h2>Skills Overview</h2>
               {skillsList.length>0 ? (
                <div className="donut">
                  <Chart
                    options={options}
                    series={series}
                    type="donut"
                    width="400"
                  />
                </div>
              ) : (
                <p>Add skills to creat your chart</p>
              )} 
            </div>
          </div>
        </div>
        <AddSkillsModal show={show} onClose={() => setShow(false)} />
        {editable&&<EditSkillModal showEditModal={showEditModal} onCloseEditModal={()=>setShowEditModal(false)} editable={editable}/>}
      </section>
    </main>
  );
};

export default MySkills;
