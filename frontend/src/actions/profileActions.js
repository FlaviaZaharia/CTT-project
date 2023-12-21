import * as actionTypes from "../actions/types";
import axios from "axios";
import store from "../store";

export const updateSkills = (token, skills) => async (dispatch) => {
  try {
    const res = await axios.put(
      "api/profile/update-profile",
      { skills },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({
      type: actionTypes.UPDATE_SKILLS,
      payload: res.data,
    });
    localStorage.setItem("auth", JSON.stringify(store.getState().auth));
  } catch (error) {
    console.log(error);
  }
};

export const updateProfileDetails =
  (token, firstNameEdit, lastNameEdit, location, selected, picUrl) =>
  async (dispatch) => {
    try {
      const res = await axios.put(
        "api/profile/update-profile",
        { firstNameEdit, lastNameEdit, location, selected, picUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const firstName = firstNameEdit;
      const lastName = lastNameEdit;
      const { data } = await axios.put(
        "api/users/edit-name",
        { firstName, lastName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(data);
      dispatch({
        type: actionTypes.UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch({
        type: actionTypes.UPDATE_USER_DATA,
        payload:{
          firstName:data.firstName,
          lastName:data.lastName
        }
      });
      localStorage.setItem("auth", JSON.stringify(store.getState().auth));
    } catch (error) {
      console.log(error);
    }
  };
