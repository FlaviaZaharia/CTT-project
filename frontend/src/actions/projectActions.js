import * as actionTypes from "../actions/types";
import axios from "axios";
import store from "../store";

export const getAllProjects = (token) => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/project/get-projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({
      type: actionTypes.GET_ALL_PROJECTS,
      payload: data.projects,
    });
    localStorage.setItem("auth", JSON.stringify(store.getState().auth));
  } catch (err) {
    console.log(err);
  }
};

export const getProjectDetails = (project) => async (dispatch) => {
  dispatch({
    type: actionTypes.GET_PROJECT_DETAILS,
    payload: project,
  });
  localStorage.setItem("auth", JSON.stringify(store.getState().auth));
};

export const getCurrentProject = (id, token) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/tasks/get-projects-task/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({
      type: actionTypes.GET_CURRENT_PROJECT_TASKS,
      payload: data.tasks,
    });
    localStorage.setItem("auth", JSON.stringify(store.getState().auth));
  } catch (error) {
    console.log(error);
  }
};

export const updateTeam = (id, team, token) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `/api/project/update-team-members/${id}`,
      { team },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({
      type: actionTypes.UPDATE_TEAM,
      payload: data.updatedProject,
    });
    localStorage.setItem("auth", JSON.stringify(store.getState().auth));
  } catch (error) {
    console.log(error);
  }
};
export const deleteProject = (id, token) => async (dispatch) => {
  try {
    await axios.delete(`/api/project/delete-project/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({
      type: actionTypes.DELETE_PROJECT,
      payload: id,
    });
    localStorage.setItem("auth", JSON.stringify(store.getState().auth));
  } catch (error) {
    console.log(error);
  }
};

export const addProject =
  (title, projectDomain, description, token) => async (dispatch) => {
    try {
      let domain = projectDomain.value;
      const { data } = await axios.post(
        "/api/project/create-project",
        { title, domain, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({
        type: actionTypes.ADD_NEW_PROJECT,
        payload: data,
      });
      localStorage.setItem("auth", JSON.stringify(store.getState().auth));
    } catch (error) {
      console.log(error);
    }
  };

export const editProject =
  (updateTitle, updateDesc, updateDomain, token, id) => async (dispatch) => {
    try {
      const { data } = await axios.put(
        `/api/project/edit-project-details/${id}`,
        { updateTitle, updateDomain, updateDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch({
        type: actionTypes.EDIT_PROJECT_DETAILS,
        payload: data,
      });
      localStorage.setItem("auth", JSON.stringify(store.getState().auth));
    } catch (error) {
      console.log(error);
    }
  };

export const getAllTeam = (team, ownerId) => async (dispatch) => {
  let arr = [];
  const teamArray = team.map(async (teamMember) => {
    const email = teamMember.email;
    const result = await axios.get(`/api/users/get-user-by-email/${email}`);
    return result.data;
  });
  const resultArray = await Promise.all(teamArray);
  resultArray.map((item) =>
    arr.push({ label: item.name, value: item.userData })
  );
  axios
    .get(`/api/users/get-user/${ownerId}`)
    .then((res) => arr.push({ label: res.data.name, value: res.data.userData }))
    .catch((error) => console.log(error));

  dispatch({
    type: actionTypes.GET_FULL_TEAM,
    payload: arr,
  });
  localStorage.setItem("auth", JSON.stringify(store.getState().auth));
};

export const getColumns=(id,token)=>async(dispatch)=>{
  try {
    const { data } = await axios.get(`/api/column/get-columns/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({
      type: actionTypes.GET_CURRENT_COLUMNS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
}
