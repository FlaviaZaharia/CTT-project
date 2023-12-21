import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
const ClockHoursApprove = () => {
  const userInfo = useSelector((user) => {
    return user.auth;
  });

  const [timesh, setTimesh] = useState([]);
  const token = userInfo.userData.token;
  const getTimesheets = async () => {
    axios
      .get("/api/timesheet/get-timesheets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ff = res.data.t.map((x) =>
          x.timeshh.filter((xx) => xx.status === "Pending")
        );
        setTimesh(ff);
      })
      .catch((error) => console.log(error));
  };
  const handleStatus = async (status, id) => {
    await axios.put(
      `/api/timesheet/edit-timesheet/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };
  useEffect(() => getTimesheets(), []);
  useEffect(() => getTimesheets, [handleStatus]);
  return (
    <div className="clock-hours-container">
      {timesh &&
        timesh.map((t) =>
          t.map((tt, index) => {
            return (
              <div className="clock-hours approve" key={index}>
                <div className="section-project">
                  <div className="sp">
                    Project:
                    <br />
                    {tt.projectId}
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">Task:{tt.taskId}</div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    {new Date(tt.startDate).getDate()}/
                    {new Date(tt.startDate).getMonth() + 1}: {tt.hoursArray[0]}h
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    {new Date(tt.startDate).getDate() + 1}/
                    {new Date(tt.startDate).getMonth() + 1}: {tt.hoursArray[1]}h
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    {new Date(tt.startDate).getDate() + 2}/
                    {new Date(tt.startDate).getMonth() + 1}: {tt.hoursArray[2]}h
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    {new Date(tt.startDate).getDate() + 3}/
                    {new Date(tt.startDate).getMonth() + 1}: {tt.hoursArray[3]}h
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    {new Date(tt.startDate).getDate() + 4}/
                    {new Date(tt.startDate).getMonth() + 1}: {tt.hoursArray[4]}h
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    {new Date(tt.startDate).getDate() + 5}/
                    {new Date(tt.startDate).getMonth() + 1}: {tt.hoursArray[5]}h
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    {new Date(tt.startDate).getDate() + 6}/
                    {new Date(tt.startDate).getMonth() + 1}:{" "}
                    {tt.hoursArray[6] || 0}h
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    <button onClick={() => handleStatus("Approved", tt._id)}>
                      Approve
                    </button>
                  </div>
                </div>
                <div className="section-project">
                  <div className="sp">
                    <button onClick={() => handleStatus("Rejected", tt._id)}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
    </div>
  );
};

export default ClockHoursApprove;
