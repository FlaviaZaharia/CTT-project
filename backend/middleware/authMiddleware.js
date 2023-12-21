const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const ErrorHandler = require("../../utils/ErrorHandler");

const protectPrivateRoutes = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ErrorHandler("Not authorized to acces this route,no token", 401)
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PASS);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("No user found with this id", 404));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(
      new ErrorHandler("You are not authorized to access this route", 401)
    );
  }
};

module.exports = { protectPrivateRoutes };
