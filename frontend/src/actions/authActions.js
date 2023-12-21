import * as actionTypes from "../actions/types";
import axios from "axios";
import { config } from "../config";
import store from "../store";
export const login = (email, password) => async (dispatch) => {
  dispatch({
    type: actionTypes.USER_LOADING,
  });
  try {
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      payload: data,
    });
    const res = await axios.get("/api/profile/get-profile", {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    dispatch({
      type: actionTypes.GET_PROFILE,
      payload: res.data,
    });
    localStorage.setItem("auth", JSON.stringify(store.getState().auth));
  } catch (error) {
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      payload: error.response.data.error,
    });
  }
};

export const register =
  (firstName, lastName, email, password) => async (dispatch) => {
    dispatch({
      type: actionTypes.USER_LOADING,
    });
    try {
      const { data } = await axios.post(
        "/api/users/register",
        { firstName, lastName, email, password },
        config
      );
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
        payload: data,
      });
      const res = await axios.post(
        "/api/profile/set-profile",
        { firstName, lastName },
        {
          headers: { Authorization: `Bearer ${data.token}` },
        }
      );
      dispatch({
        type: actionTypes.SET_PROFILE,
        payload: res.data,
      });
      localStorage.setItem("auth", JSON.stringify(store.getState().auth));
    } catch (error) {
      dispatch({
        type: actionTypes.REGISTER_FAIL,
        payload: error.response.data.error,
      });
    }
  };
