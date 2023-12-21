const Task = require("../models/Task");
const ErrorHandler = require("../../utils/ErrorHandler");
const Column = require("../models/Column");
const createTask = async (req, res, next) => {
  const userId = req.user.id;
  const { taskTitle, taskDescription, assignee, priority, projectId, status } =
    req.body;
  if (!userId) {
    return next(
      new ErrorHandler("You are not authorized to create tasks", 401)
    );
  }
  if (!projectId) {
    return next(new ErrorHandler("Please provide a project id", 400));
  }
  if (!taskTitle) {
    return next(new ErrorHandler("Please provide a title", 400));
  }
  if (!taskDescription) {
    return next(new ErrorHandler("Please provide a description", 400));
  }
  if (!priority) {
    return next(new ErrorHandler("Please provide a difficulty", 400));
  }
  try {
    const task = await Task.create({
      projectId,
      createdBy: {
        userId: userId,
        email: req.user.email,
        name: req.user.firstName + " " + req.user.lastName,
      },
      taskTitle,
      taskDescription,
      assignee,
      priority,
      status,
    });
    if (task) {
      res.status(201).json({
        task,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  const userId = req.user.id;
  const {
    taskTitle,
    taskDescription,
    assignee,
    status,
    priority,
    colId,
    colExchange,
  } = req.body;
  if (!userId) {
    return next(new Error("You are not authorized to edit this project", 401));
  }
  try {
    const updateTask = await Task.findByIdAndUpdate(req.params.id, {
      taskTitle,
      taskDescription,
      assignee,
      status,
      priority,
    });
    if (!updateTask) {
      return next(new ErrorHandler("Task not found", 404));
    }
    if (colExchange) {
      const col = await Column.findOne({ tasks: { _id: req.params.id } });
      if (col) {
        if (col.columnName !== status) {
          const column = await Column.findOneAndUpdate(
            { _id: col._id },
            {
              $pull: { tasks: { _id: req.params.id } },
            }
          );
          const column2 = await Column.findOneAndUpdate(
            { columnName: status },
            { $push: { tasks: { _id: req.params.id } } }
          );
        }
      }
    }

    const taskUpdated = await Task.findById(req.params.id);
    res.status(200).json({
      taskUpdated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }
    await task.remove();
    res.status(200).json({
      success: true,
      data: "Task deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getAllProjectTasks = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
  try {
    const tasks = await Task.find({ projectId: req.params.id });
    if (tasks) {
      res.status(200).json({
        success: true,
        tasks,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getSpecificUserTasks = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
  try {
    const tasks = await Task.find({
      projectId: req.params.id,
      assignee: userId,
    });
    if (tasks) {
      res.status(200).json({
        tasks,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.status(200).json({
        task,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllProjectTasks,
  getSpecificUserTasks,
  getTask,
};
