import "./clock-hours.scss";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const ClockHours = () => {
  let projectId, taskId, startDate, endDate, hoursArray, comment, status;
  const [day1, setDay1] = useState(0);
  const [day2, setDay2] = useState(0);
  const [day3, setDay3] = useState(0);
  const [day4, setDay4] = useState(0);
  const [day5, setDay5] = useState(0);
  const [day6, setDay6] = useState(0);
  const [day7, setDay7] = useState(0);
  const [total, setTotal] = useState(0);
  const [projectArray, setProjectArray] = useState([]);
  const [selectProjectArray, setSelectProjectArray] = useState([]);
  const [project, setProject] = useState({ label: "", value: "" });
  const [task, setTask] = useState({ label: "", value: "" });
  const [selectTasks, setSelectTasks] = useState([]);
  const [submit, setSubmit] = useState(true);
  const [allTimesheet, setAllTimesheet] = useState([]);
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const token = userInfo.userData.token;
  const getProjects = async () => {
    axios
      .get("/api/project/get-projects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjectArray(res.data.projects);
        return res.data.projects;
      })
      .then((res) => {
        const arr = res.map((p) => {
          return { label: p.projectTitle, value: p._id };
        });
        return arr;
      })
      .then((res) => setSelectProjectArray(res))
      .catch((error) => console.log(error));
  };

  useEffect(() => getProjects(), []);
  useEffect(() => {
    setTotal(
      parseInt(day1) +
        parseInt(day2) +
        parseInt(day3) +
        parseInt(day4) +
        parseInt(day5) +
        parseInt(day6) +
        parseInt(day7) || 0
    );
  }, [day1, day2, day3, day4, day5, day6, day7]);
  let id;
  const createTimesheet = async () => {
    projectId = project.value;
    taskId = task.value;
    startDate = curr.getFullYear() + "-" + m + " " + first;
    endDate = curr.getFullYear() + "-" + m + " " + last;
    console.log(startDate, endDate);
    hoursArray = [day1, day2, day3, day4, day5, day6, day7];
    try {
      await axios.post(
        "/api/timesheet/create-timesheet",
        { projectId, taskId, startDate, endDate, hoursArray },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProject({Label:"",value:""});
      // setTask({Label:"",value:""});
      setDay1(0);
      setDay2(0);
      setDay3(0);
      setDay4(0);
      setDay5(0);
      setDay6(0);
      setDay7(0);
      setTotal(0);
      setTask({Label:"",value:""});
    } catch (error) {
      console.log(error);
    }
  };

  const getTimesheets = async () => {
    axios
      .get("/api/timesheet/get-timesheets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllTimesheet(res.data.t))
      .catch((error) => console.log(error));
  };
  useEffect(() => getTimesheets(), []);
  const editTimesheetStatus = async () => {
    try {
      await axios.put(
        `/api/timesheet/edit-timesheet/${id}`,
        { status, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getTasks = async () => {
    id = project.value;
    axios
      .get(`/api/tasks/get-user-projects-tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        return res.data.tasks;
      })
      .then((res) => {
        const arr = res.map((p) => {
          return { label: p.taskTitle, value: p._id };
        });
        return arr;
      })
      .then((res) => setSelectTasks(res))
      .catch((error) => console.log(error));
  };
  let curr = new Date();
  let first = curr.getDate() - curr.getDay() + 1;
  let m = curr.getMonth() + 1;
  let last = first + 6;
  useEffect(() => {
    setTask({ label: "", value: "" });
    getTasks();
  }, [project]);
  return (
    <div className="clock-hours-container">
      <div className="clock-hours">
        <div className="section-project">
          <div>Project</div>
          <Select
          value={project}
            className="timesheet-dropdown"
            defaultValue={null}
            options={selectProjectArray}
            onChange={setProject}
          />
        </div>
        <div className="section-project">
          <div>Task</div>
          <Select
            value={task}
            className="timesheet-dropdown"
            defaultValue={null}
            onChange={setTask}
            options={selectTasks}
          />
        </div>
        <div className="inputs">
          <div className="input-section">
            <div>
              {first}/{m}
            </div>
            <input
              type="number"
              id="day1"
              name="day1"
              placeholder="0"
              value={day1}
              onChange={(e) => setDay1(e.target.value)}
            />
          </div>
          <div className="input-section">
            <div>
              {first + 1}/{m}
            </div>
            <input
              type="number"
              id="day2"
              name="day2"
              placeholder="0"
              value={day2}
              onChange={(e) => setDay2(e.target.value)}
            />
          </div>
          <div className="input-section">
            <div>
              {first + 2}/{m}
            </div>
            <input
              type="number"
              id="day3"
              name="day3"
              placeholder="0"
              value={day3}
              onChange={(e) => setDay3(e.target.value)}
            />
          </div>
          <div className="input-section">
            <div>
              {first + 3}/{m}
            </div>
            <input
              type="number"
              id="day4"
              name="day4"
              placeholder="0"
              value={day4}
              onChange={(e) => setDay4(e.target.value)}
            />
          </div>
          <div className="input-section">
            <div>
              {first + 4}/{m}
            </div>
            <input
              type="number"
              id="day5"
              name="day5"
              placeholder="0"
              value={day5}
              onChange={(e) => setDay5(e.target.value)}
            />
          </div>
          <div className="input-section">
            <div>
              {first + 5}/{m}
            </div>
            <input
              type="number"
              id="day6"
              name="day6"
              placeholder="0"
              value={day6}
              onChange={(e) => setDay6(e.target.value)}
            />
          </div>
          <div className="input-section">
            <div>
              {last}/{m}
            </div>
            <input
              type="number"
              id="day7"
              name="day7"
              placeholder="0"
              value={day7}
              onChange={(e) => setDay7(e.target.value)}
            />
          </div>
        </div>
        <div className="total-hours-cont">
          <div>Total</div>
          <div className="total-hours">{total}</div>
        </div>
      </div>
      <div>
        <button className="timesh-button" onClick={createTimesheet}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ClockHours;
