const Profile = require("../models/Profile");
const ErrorHandler = require("../../utils/ErrorHandler");

const getProfile = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return next(new ErrorHandler("Could not find profile", 404));
    }
    res.status(200).json({
      success: true,
      skillsList: profile.skillsList,
      profilePictureUrl: profile.profilePictureUrl,
      location: profile.location,
      projectList: profile.projectList,
      teamsList: profile.teamsList,
      firstName: profile.firstName,
      lastName: profile.lastName,
      selected: profile.selected,
    });
  } catch (error) {
    next(error);
  }
};

const setProfile = async (req, res, next) => {
  const {
    picUrl,
    skills,
    location,
    projects,
    teams,
    firstName,
    lastName,
    selected,
  } = req.body;
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
  try {
    const profile = await Profile.create({
      $push: { skillsList: skills },
      $push: { projectList: projects },
      $push: { teamsList: teams },
      profilePictureUrl: picUrl,
      skillsList: skills,
      user: userId,
      location,
      selected,
      firstName,
      lastName,
      projectList: projects,
      teamsList: teams,
    });
    if (profile) {
      res.status(201).json({
        success: true,
        id: profile._id,
        data: "Profile created",
        profilePictureUrl: profile.profilePictureUrl,
        skillsList: profile.skillsList,
        teamsList: profile.teamsList,
        projectList: profile.projectList,
        location: profile.location,
        selected: profile.selected,
        user: profile.user,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("User not found", 401));
  }
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return next(new ErrorHandler("Profile not found", 404));
    }
    //make sure the logged in user matches the profile user
    if (profile.user.toString() !== userId) {
      return next(new ErrorHandler("User not authorized", 401));
    }
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        profilePictureUrl: req.body.picUrl,
        skillsList: req.body.skills,
        projectList: req.body.projectList,
        teamsList: req.body.teamsList,
        firstName: req.body.firstNameEdit,
        lastName: req.body.lastNameEdit,
        location: req.body.location,
        selected: req.body.selected,
      }
    );

    const prfUpdated = await Profile.findById(updatedProfile._id);
    res.status(200).json({
      success: true,
      data: "Profile updated",
      id: prfUpdated._id,
      user: prfUpdated.user,
      firstName: prfUpdated.firstName,
      lastName: prfUpdated.lastName,
      skillsList: prfUpdated.skillsList,
      teamsList: prfUpdated.teamsList,
      projectList: prfUpdated.projectList,
      profilePictureUrl: prfUpdated.profilePictureUrl,
      location: prfUpdated.location,
      selected: prfUpdated.selected,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  setProfile,
  updateProfile,
};
