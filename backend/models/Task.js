const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Projects",
    },
    taskTitle: {
      type: String,
      required: [true, "Please provide a project title"],
    },
    createdBy:{
      type:Object,
      required: true,
    },
    taskDescription: {
      type: String,
      required: [true, "Please provide a description"],
    },
    status: {
      type: String,
      default: "Ready for development",
    },
    assignee: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Users",
      required:true
    },
    priority: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tasks", taskSchema);