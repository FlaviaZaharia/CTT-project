const express=require('express')
const router = express.Router();
const { protectPrivateRoutes } = require("../middleware/authMiddleware");
const {createTask,updateTask,deleteTask,getAllProjectTasks,getSpecificUserTasks,getTask}=require('../controllers/tasksController');
const { Router } = require('express');
router.post("/create-task",protectPrivateRoutes,createTask);
router.get("/get-projects-task/:id",protectPrivateRoutes,getAllProjectTasks);
router.get("/get-user-projects-tasks/:id",protectPrivateRoutes,getSpecificUserTasks);
router.delete("/delete-task/:id",protectPrivateRoutes,deleteTask);
router.put("/update-task/:id",protectPrivateRoutes,updateTask);
router.get("/get-task/:id",protectPrivateRoutes,getTask);

module.exports=router;