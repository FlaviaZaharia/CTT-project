const mongoose = require("mongoose");

const timesheetSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Projects",
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tasks",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      default: "Pending",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    hoursArray: {
      type: Array,
      required: true,
      default: [],
    },
    comment:{
      type:String,
      default:""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timesheets", timesheetSchema);
