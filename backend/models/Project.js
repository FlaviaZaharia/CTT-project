const mongoose = require("mongoose");
const projectSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required:true
    },
    projectTitle: {
      type: String,
      required:true
    },
    projectDomain: {
      type: String,
      required:true
    },
    projectDescription: {
      type: String,
      default:""
    },
    teamMembers: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Projects", projectSchema);
