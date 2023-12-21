const Timesheet = require("../models/Timesheet");
const ErrorHandler = require("../../utils/ErrorHandler");
const Project = require("../models/Project");

const createTimesheet = async (req, res, next) => {
  const { projectId, taskId, startDate, endDate, hoursArray } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return next(
      new ErrorHandler("You are not authorized to create timesheets", 401)
    );
  }
  if (!projectId || !taskId || !startDate || !endDate || !hoursArray) {
    return next(new ErrorHandler("Please provide all the information", 400));
  }
  try {
    const timesheet = await Timesheet.create({
      projectId,
      taskId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      hoursArray,
      employee: userId,
    });
    if (timesheet) {
      res.status(201).json({
        timesheet,
      });
    }
  } catch (error) {
    next(error);
  }
};

const editTimesheetStatus = async (req, res, next) => {
  const userId = req.user.id;
  const { status, comment } = req.body;

  if (!userId) {
    return next(new ErrorHandler("You are not authorized to access this route", 
    401));
  }
  try{
    const timesheet1=await Timesheet.findById(req.params.id);
    if(timesheet1){
        const prj=await Project.findById(timesheet1.projectId)
        if(prj){
            if(userId===prj.owner.toString()){
            const timesheet=await Timesheet.findByIdAndUpdate(req.params.id,
                {status,comment});
                if(timesheet){
                    res.status(200).json({
                        data:"Timesheet updated"
                    })
                }
            }
            else
            {
                return next(new ErrorHandler("You are not authorized to edit these timesheets",
                401))
            }
        }
    }
    else{
        return next(new ErrorHandler("No timesheet found",404))
    }
  }
  catch(error){
    next(error);
  }
};

const getTimesheets=async(req,res,next)=>{
  const userId = req.user.id;
  
  if (!userId) {
    return next(new ErrorHandler("You are not authorized to access this route", 
    401));
  }
  try{
    const project=await Project.find({owner:userId});
    const timesh=project.map(async(p)=>
    {
      const timeshh=await Timesheet.find({projectId:p._id})
      return {timeshh,"p":p.projectTitle}
    }
    )
    const t=await Promise.all(timesh)
    res.status(200).json({
      t
    })
    
    }
  catch(error){
    next(error)
  }
}


module.exports = {
  createTimesheet,
  editTimesheetStatus,
  getTimesheets
};
