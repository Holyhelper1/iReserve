const mongoose = require("mongoose");
const roles = require("../constants/roles");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    login: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: roles.CLIENT,
    },
    avatar: {
      type: String,
      required: false,
      validate: {
        validator: validator.isURL,
        message: "Image must be a valid URL",
      },
    },
    bookingHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
