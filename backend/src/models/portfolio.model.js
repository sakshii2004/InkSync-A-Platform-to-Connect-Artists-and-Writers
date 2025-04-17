import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String], // store image URLs or paths
      validate: [arrayLimit, "{PATH} exceeds the limit of 25"],
      default: [],
    },

    type: {
      type: String,
      enum: ["Artist", "Writer"],
      required: true,
    },

    externalLink: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/[\w.-]+\.[a-z]{2,}.*$/.test(v);
        },
        message: "Please enter a valid URL",
      },
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },

  { timestamps: true }

);

function arrayLimit(val) {
  return !val || (Array.isArray(val) && val.length <= 25);
}

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
