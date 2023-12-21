const express=require('express')
const router = express.Router();
const { protectPrivateRoutes } = require("../middleware/authMiddleware");
const {createTimesheet,editTimesheetStatus,getTimesheets}=require('../controllers/timesheetController');
const { Router } = require('express');
router.post("/create-timesheet",protectPrivateRoutes,createTimesheet);
router.put("/edit-timesheet/:id",protectPrivateRoutes,editTimesheetStatus);
router.get("/get-timesheets",protectPrivateRoutes,getTimesheets)

module.exports=router;