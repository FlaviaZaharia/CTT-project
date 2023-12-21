const express=require('express')
const router = express.Router();
const {createProject,updateProjectTeam,getProjects,editProjectDetails,deleteProject}=require('../controllers/projectController')
const { protectPrivateRoutes } = require("../middleware/authMiddleware");
router.post("/create-project",protectPrivateRoutes,createProject);
router.get("/get-projects",protectPrivateRoutes,getProjects);
router.put("/update-team-members/:id",protectPrivateRoutes,updateProjectTeam);
router.put("/edit-project-details/:id",protectPrivateRoutes,editProjectDetails);
router.delete("/delete-project/:id",protectPrivateRoutes,deleteProject);
module.exports = router;