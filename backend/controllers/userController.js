const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ErrorHandler = require("../../utils/ErrorHandler");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");
const { update } = require("../models/User");
const { isValidObjectId } = require("mongoose");


const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return next(new ErrorHandler("Invalid credentials", 401));
    }
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return next(
        new ErrorHandler(
          "There is already an account associated with this email",
          400
        )
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    if (user) {
      res.status(201).json({
        success: true,
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  if(isValidObjectId(req.params.ownerId)){
  try {
    const user = await User.findById(req.params.ownerId);
    if(!user){
      return next(new ErrorHandler("No",404))
    }
    if (user)
      res.status(200).json({
        name: user.firstName + " " + user.lastName,
        userData: {
          _id: user.id,
          email: user.email,
          name: user.firstName + " " + user.lastName,
        },
      });
  } catch (error) {
    next(error);
  }
}
else{
  return next(new ErrorHandler("no ObjectId found",404))
}
};

const getUserByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.status(200).json({
        name: user.firstName + " " + user.lastName,
        userData: {
          _id: user.id,
          email: user.email,
          name: user.firstName + " " + user.lastName,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Email could not be sent", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `
    <h1>You have requested password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset",
        text: message,
      });
      res.status(200).json({
        success: "true",
        data: "Email sent",
      });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return next(new ErrorHandler("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

const checkTokenIsValid = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, //ensuring that the token is not expired
    });
    if (!user) {
      // return next(new ErrorHandler("Invalid reset token", 400));
      res.status(200).json({
        isValid: false,
        data: "Token is not valid",
      });
    } else
      res.status(200).json({
        isValid: true,
        success: true,
        data: "Token is valid",
      });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  if (!req.body.password) {
    return next(new ErrorHandler("Please provide a password", 400));
  }
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, 
      //ensuring that the token is not expired
    });
    if (!user) {
      return next(new ErrorHandler("Invalid reset token", 404));
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(201).json({
      success: true,
      data: "Password reset successful",
    });
  } catch (error) {
    return next(error);
  }
};

const editName = async (req, res, next) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return next(
      new ErrorHandler("Firstname and lastname cannot be empty", 400)
    );
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return new (ErrorHandler("User not found", 404))();
    }
    const updateUser = await User.findByIdAndUpdate(req.user._id, {
      firstName,
      lastName,
    });

    const updatedUser = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      id: updateUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updateUser.email,
    });
  } catch (err) {
    next(err);
  }
};
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_PASS, { expiresIn: "1d" });
};

const checkTokenIsNotExpired = async (req, res, next) => {
  const user = req.user;
  try {
    if (user)
      res.status(200).json({
        success: true,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getUser,
  forgotPassword,
  resetPassword,
  editName,
  checkTokenIsValid,
  checkTokenIsNotExpired,
  getUserByEmail,
};
