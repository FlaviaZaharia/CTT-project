import "./skill-list-item.scss";
import pen from "../../assets/pen.png";
import deleteB from "../../assets/x-mark.png";
const SkillsListItem = (props) => {
  const { domain, subDomain, measure, id } = props.data;
  return (
    <div className="skill-list-container">
      <div className="domain-part">
        <h4>{domain}</h4>
        <p>{subDomain}</p>
      </div>
      <div className="exp-part">
        <p>
        {measure}
        </p>
      </div>
      <div className="edit-button-img">
        <button onClick={()=>props.openEditModal(domain,subDomain,measure,id)}><img  src={pen} alt="edit" id="edit-img"/></button>
        <button onClick={()=>props.removeItem(id)}><img src={deleteB} alt="delete" /></button>
      </div>
    </div>
  );
};

export default SkillsListItem;
