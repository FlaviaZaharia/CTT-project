import * as actionTypes from "../actions/types";
const initialState = {
  userData: {},
  profile: {},
  currentProject: {},
  currentProjectTasks: [],
  currentColumns: {},
  allProjects: [],
  isLoading: false,
  isAuthenticated: false,
  isError: false,
  errorText: "",
  fullTeam: [],
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        isError: false,
        errorText: "",
      };
    case actionTypes.USER_LOADING:
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
        isError: false,
        errorText: "",
      };
    case actionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        isError: false,
        errorText: "",
      };
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        isAuthenticated: true,
        isLoading: false,
        isError: false,
        errorText: "",
      };
    case actionTypes.LOGIN_FAIL:
    case actionTypes.REGISTER_FAIL:
      return {
        ...state,
        userData: {},
        isAuthenticated: false,
        isLoading: false,
        isError: true,
        errorText: action.payload,
      };
    case actionTypes.GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case actionTypes.UPDATE_PROFILE:
    case actionTypes.UPDATE_SKILLS:
      return {
        ...state,
        profile: action.payload,
      };
    case actionTypes.SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case actionTypes.UPDATE_TEAM:
      return {
        ...state,
        currentProject: action.payload,
      };
    case actionTypes.GET_PROJECT_DETAILS:
      return {
        ...state,
        currentProject: action.payload,
      };
    case actionTypes.DELETE_PROJECT:
      return {
        ...state,
        currentProject: {},
        allProjects: state.allProjects.filter((x) => x._id !== action.payload),
      };
    case actionTypes.ADD_NEW_PROJECT:
      return {
        ...state,
        allProjects: [...state.allProjects, action.payload],
      };
    case actionTypes.EDIT_PROJECT_DETAILS: {
      return {
        ...state,
        currentProject: action.payload,
      };
    }
    case actionTypes.GET_ALL_PROJECTS:
      return { ...state, allProjects: action.payload };
    case actionTypes.GET_FULL_TEAM:
      return { ...state, fullTeam: action.payload };
    case actionTypes.UPDATE_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
        },
      };
    case actionTypes.GET_CURRENT_PROJECT_TASKS:
      return { ...state, currentProjectTasks: action.payload };
    case actionTypes.GET_CURRENT_COLUMNS:
      return { ...state, currentColumns: action.payload };
    case actionTypes.LOGOUT:
      localStorage.removeItem("auth");
      return {
        ...state,
        userData: {},
        isAuthenticated: false,
        isLoading: false,
        isError: false,
        errorText: "",
        profile: {},
        currentProject: {},
        allProjects: [],
        currentProjectTasks:[],
        fullTeam:[]
      };
    default:
      return state;
  }
};

export default authReducer;
