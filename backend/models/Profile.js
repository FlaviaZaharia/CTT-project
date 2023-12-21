const mongoose = require("mongoose");
const profileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    firstName:{
      type:String,
      required:true,
    },
    lastName:{
      type:String,
      required:true
    },
    skillsList: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
      default: "No location set",
    },
    selected:{
      type:String,
      default:""
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profiles", profileSchema);
