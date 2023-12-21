const Column = require("../models/Column");
const ErrorHandler = require("../../utils/ErrorHandler");
const Task = require("../models/Task");
const User = require("../models/User");
const { use } = require("bcrypt/promises");

const addColumn = async (req, res, next) => {
  const userId = req.user.id;
  const { columnName, columnId, projectId } = req.body;
  if (!userId) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!columnName) {
    return next(new ErrorHandler("Please provide a title", 400));
  }
  try {
    const column = await Column.create({
      columnName,
      columnId,
      projectId,
    });
    if (column) {
      res.status(201).json({
        column,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllColumnsName = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("User not found", 404));
  }
  try {
    const columns = await Column.find({ projectId: req.params.id });
    if (columns) {
      res.status(200).json({
        columns,
      });
    } else {
      return next(new ErrorHandler("No columns found", 404));
    }
  } catch (error) {
    next(error);
  }
};
const getAllColumns = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("User not found", 404));
  }
  try {
    const columns = await Column.find({ projectId: req.params.id });
    const obj = {};
    const columnsArray = columns.map(async (c) => {
      let tasksArray = c.tasks.map(async (t) => {
        let tsk = await Task.findById(t._id);
        let user=await User.findById(tsk.assignee)
        return {...tsk._doc,name:user.firstName+" "+user.lastName};
      });
      const result2 = await Promise.all(tasksArray);
      return { ...c._doc, tasks: result2 };
    });
    const result1 = await Promise.all(columnsArray);

    result1.map((item) =>
      Object.assign(obj, {
        [item._id]: { name: item.columnName, items: item.tasks },
      })
    );

    if (columns) {
      res.status(200).json({
        ...obj,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateTasksOnColumn = async (req, res, next) => {
  const userId = req.user.id;
  const { task } = req.body;
  const colId = req.params.colId;
  if (!userId) {
    return next(new ErrorHandler("User not found", 404));
  }
  try {
    const column = await Column.findByIdAndUpdate(colId, {
      $push: { tasks: { _id: task } },
    });
    if (column) {
      const updatedColumn = await Column.findById(colId);
      if (updatedColumn)
        res.status(200).json({
          updatedColumn,
        });
    }
  } catch (error) {
    next(error);
  }
};

const updateTasksArrayOnColumns = async (req, res, next) => {
  const userId = req.user.id;
  const { task } = req.body;
  const colId = req.params.colId;
  if (!userId) {
    return next(new ErrorHandler("User not found", 404));
  }
  try {
    const column = await Column.findByIdAndUpdate(colId, {
      $set: { tasks: task },
    });
    if (column) {
      const updatedColumn = await Column.findById(colId);
      if (updatedColumn)
        res.status(200).json({
          updatedColumn,
        });
    }
  } catch (error) {
    next(error);
  }
};


const deleteTaskfromColumn = async (req, res, next) => {
  const userId = req.user.id;
  const { _id } = req.body;
  if (!userId) {
    return next(new ErrorHandler("User not found", 404));
  }
  try {
    const col = await Column.findByIdAndUpdate(req.params.currentColumn, {
      $pull: { tasks: { _id: _id } },
    });
    if (col) {
      const updatedColumn = await Column.findById(req.params.currentColumn);
      if (updatedColumn) {
        res.status(200).json({
          updatedColumn,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addColumn,
  getAllColumns,
  updateTasksOnColumn,
  updateTasksArrayOnColumns,
  getAllColumnsName,
  deleteTaskfromColumn
};
