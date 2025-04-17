import mongoose from "mongoose";

const colabSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'completed', 'ended'],
      default: 'pending',
    },
    dateAccepted: {
      type: Date,
      default: null
    },
    dateDeclined: {
      type: Date,
      default: null
    },
    dateWithdrawn: {
      type: Date,
      default: null
    },
    dateEnded: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

const Colab = mongoose.model("Colab", colabSchema);

export default Colab;