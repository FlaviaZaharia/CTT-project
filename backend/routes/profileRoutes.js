const express = require("express");
const router = express.Router();

const { getProfile, setProfile,updateProfile } = require("../controllers/profileController");

const { protectPrivateRoutes } = require("../middleware/authMiddleware");

router.get("/get-profile",protectPrivateRoutes, getProfile);
router.post("/set-profile",protectPrivateRoutes, setProfile);
router.put("/update-profile",protectPrivateRoutes,updateProfile);
module.exports=router;