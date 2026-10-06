const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "adopted"],
      default: "available",
    },

    adopter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    thankYouMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Dog = mongoose.model("Dog", dogSchema);

module.exports = Dog;
