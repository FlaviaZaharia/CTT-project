const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUser,
  forgotPassword,
  resetPassword,
  editName,
  checkTokenIsValid,
  checkTokenIsNotExpired,
  getUserByEmail
} = require("../controllers/userController");
const { protectPrivateRoutes } = require("../middleware/authMiddleware");
router.post("/register", register);
router.post("/login", login);
router.get("/get-user/:ownerId", getUser); 
router.get("/get-user-by-email/:email",getUserByEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.put("/edit-name",protectPrivateRoutes, editName);  //use auth middleware as the second parameter to protect route
router.get("/reset-password/:resetToken",checkTokenIsValid);
router.get("/check-token-valid",protectPrivateRoutes,checkTokenIsNotExpired);
module.exports = router;
