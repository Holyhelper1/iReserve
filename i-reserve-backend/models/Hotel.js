const mongoose = require("mongoose");
const validator = require("validator");

const HotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: "Image must be a valid URL",
      },
    },
    stars: {
      type: Number,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", HotelSchema);
module.exports = Hotel;
