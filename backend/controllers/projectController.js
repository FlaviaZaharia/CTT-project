const Project = require("../models/Project");
const ErrorHandler = require("../../utils/ErrorHandler");
const Task = require("../models/Task");
const Column=require("../models/Column")
const createProject = async (req, res, next) => {
  const userId = req.user.id;
  const { title, domain, team, description } = req.body;
  if (!userId) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!title) {
    return next(new ErrorHandler("Please provide a title", 400));
  }
  if (!domain) {
    return next(new ErrorHandler("Please provide a domain", 400));
  }
  try {
    const project = await Project.create({
      owner: userId,
      projectTitle: title,
      projectDomain: domain,
      projectDescription: description,
      $set: { teamMembers: team },
      teamMembers: team,
    });
    if (project) {
      res.status(201).json({
        _id: project._id,
        owner: project.owner,
        projectTitle: project.projectTitle,
        projectDomain: project.projectDomain,
        projectDescription: project.projectDescription,
        teamMembers: project.teamMembers,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  const userId = req.user.id;
  const email = req.user.email;
  if (!userId) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
  try {
    let projects = [];
    let projectMember = [];
    const projectOwnerProjects = await Project.find({ owner: userId });

    projectMember = await Project.find({
      teamMembers: { $elemMatch: { email: email } },
    });
    
    projects = [...projectOwnerProjects, ...projectMember];
    res.status(200).json({
      projects,
      email,
    });
  } catch (error) {
    next(error);
  }
};

const updateProjectTeam = async (req, res, next) => {
  const userId = req.user.id;
  const { team } = req.body;
  if (!userId) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
  if (!team) {
    return next(new ErrorHandler("Please provide an email", 400));
  }
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }
    const updateTeam = await Project.updateOne(
      { _id: project._id },
      { $set: { teamMembers: team } }
    );
    const updatedProject = await Project.findById(req.params.id);
    if (updateTeam) {
      if (updatedProject)
        res.status(200).json({
          updatedProject,
        });
    }
  } catch (error) {
    next(error);
  }
};

const editProjectDetails = async (req, res, next) => {
  const userId = req.user.id;
  const { updateTitle, updateDesc, updateDomain } = req.body;
  if (!userId) {
    return next(new Error("You are not authorized to edit this project", 401));
  }
  if (!updateTitle) {
    return next(new Error("Please provide a title", 400));
  }
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new Error("Project not found", 404));
    }
    if (project.owner.toString() !== userId) {
      return next(new Error("You are unauthorized to edit this project", 401));
    }
    const updateProject = await Project.findByIdAndUpdate(req.params.id, {
      projectTitle: updateTitle,
      projectDomain: updateDomain,
      projectDescription: updateDesc,
    });
    if (updateProject) {
      const getProject = await Project.findById(req.params.id);
      res.status(200).json({
        _id: getProject._id,
        owner: getProject.owner,
        projectTitle: getProject.projectTitle,
        projectDomain: getProject.projectDomain,
        projectDescription: getProject.projectDescription,
        teamMembers: getProject.teamMembers,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
  try {
    const project = await Project.findById(req.params.id.toString());
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }
    if (userId !== project.owner.toString()) {
      return next(
        new ErrorHandler("You are not authorized to delete this project", 401)
      );
    }
    await Column.deleteMany({ projectId: req.params.id})
    await Task.deleteMany({projectId:req.params.id})
    await project.remove();
    res.status(200).json({
      success: true,
      data: "Project deleted",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createProject,
  updateProjectTeam,
  getProjects,
  editProjectDetails,
  deleteProject,
};
