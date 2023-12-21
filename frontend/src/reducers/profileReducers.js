import * as actionTypes from "../actions/types";
const initialState = {
  userData: {},
  isLoading: false,
  isAuthenticated: false,
  isError: false,
  errorText: "",
  profile:{},
};
const profileReducer = (state = initialState, action) => {
  switch (action.types) {
    case actionTypes.UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case actionTypes.GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    default:
      return state;
  }
};

export default profileReducer;
