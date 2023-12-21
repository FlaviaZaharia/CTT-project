const mongoose = require("mongoose");
const columnSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
    },
    columnName: {
      type: String,
    },
    tasks: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Columns", columnSchema);
