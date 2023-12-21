import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import ResetPassword from "./pages/reset-password/Reset-password";
import ForgotPassword from "./pages/forgot-password/Forgot-password";
import FrontPage from "./pages/front-page/FrontPage";
import Header from "./components/Header";
import ContentPage from "./pages/content-page/ContentPage";
import Profile from "./pages/profile/Profile";
import ProjectOverview from "./pages/project-overview/ProjectOverview";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import  axios  from "axios";
import * as actionTypes from "../src/actions/types";
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((user) => {
    return user.auth;
  });
  const token = user.userData.token;

  return (
    <>
      <Router>
        <main>
          <Routes>
            <Route path="/" exact element={<FrontPage />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/forgot-password" exact element={<ForgotPassword />} />
            <Route
              path="/reset-password/:resetToken"
              exact
              element={<ResetPassword />}
            />
            <Route path="/dashboard" element={<ContentPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/project/:id" exact element={<ProjectOverview />} />
          </Routes>
        </main>
      </Router>
    </>
  );
};

export default App;
