const express = require("express");
const router = express.Router();
const {
  addColumn,
  getAllColumns,
  updateTasksOnColumn,
  updateTasksArrayOnColumns,
  deleteTaskfromColumn,
  getAllColumnsName,
} = require("../controllers/columnController");
const { protectPrivateRoutes } = require("../middleware/authMiddleware");
router.post("/create-column", protectPrivateRoutes, addColumn);
router.get("/get-columns/:id", protectPrivateRoutes, getAllColumns);
router.get("/get-columns-array/:id", protectPrivateRoutes, getAllColumnsName);
router.put(
  "/update-tasks-on-column/:colId",
  protectPrivateRoutes,
  updateTasksOnColumn
);
router.put(
  "/update-tasks-array-on-columns/:colId",
  protectPrivateRoutes,
  updateTasksArrayOnColumns
);
router.put(
  "/delete-task-from-column/:currentColumn",
  protectPrivateRoutes,
  deleteTaskfromColumn
);
module.exports = router;
