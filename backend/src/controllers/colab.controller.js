import cloudinary from"../lib/cloudinary.js"
import User from "../models/user.model.js";
import Colab from "../models/colab.model.js";
import Follow from "../models/follower.model.js";

export const sendColabRequest = async (req, res) => {
    try {
      const { senderId, receiverId, title, description } = req.body;
  
      if (!senderId || !receiverId || !title || !description) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      if (senderId === receiverId) {
        return res.status(400).json({ message: "You can't send a request to yourself." });
      }
  
      // check if users exist
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
  
      if (!sender || !receiver) {
        return res.status(404).json({ message: "Sender or receiver not found." });
      }
  
      // prevent duplicate requests
      const existing = await Colab.findOne({ sender: senderId, receiver: receiverId, title });
      if (existing) {
        return res.status(400).json({ message: "You've already sent this creator a colab request." });
      }
  
      // create new colab request
      const newColab = new Colab({
        sender: senderId,
        receiver: receiverId,
        title,
        description,
        status: "pending",
      });
  
      await newColab.save();
  
      res.status(201).json({
        message: "Colab request sent successfully",
        colab: newColab,
      });
  
    } 
    
    catch (error) {
      console.error("sendColabRequest error:", error);
      res.status(500).json({ message: "Internal server error. Please try again later." });
    }
  };

export const getSentRequests = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const requests = await Colab.find({ sender: userId, status: "pending" })
        .sort({ createdAt: -1 })
        .populate("receiver", "fullName username");
  
      res.status(200).json({ requests });
    } 
    
    catch (error) {
      console.error("getSentRequests error:", error);
      res.status(500).json({ message: "Failed to fetch sent requests." });
    }
  };

export const getReceivedRequests = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const requests = await Colab.find({ receiver: userId, status: "pending" })
        .sort({ createdAt: -1 })
        .populate("sender", "fullName username");
  
      res.status(200).json({ requests });
    } 
    
    catch (error) {
      console.error("getReceivedRequests error:", error);
      res.status(500).json({ message: "Failed to fetch received requests." });
    }
  };

export const acceptRequest = async (req, res) => {
    try {
      const { requestId } = req.params;  
      const request = await Colab.findByIdAndUpdate(
        requestId,
        { 
          status: "active",
          dateAccepted: new Date()
        },
        { new: true }
      )
      .populate("sender", "fullName username")
      .populate("receiver", "fullName username");
  
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }  
      res.status(200).json(request);
    } 
    
    catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  };

export const withdrawRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      const request = await Colab.findByIdAndUpdate(
        requestId,
        {
          status: "withdrawn",
          dateWithdrawn: new Date(), 
        },
        { new: true }
      );
  
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
  
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  };

export const declineRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      const request = await Colab.findByIdAndUpdate(
        requestId,
        {
          status: "rejected",
          dateDeclined: new Date(), 
        },
        { new: true }
      );
  
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
  
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  };
  

export const getColabs = async (req, res) => {
    try {
      const { requestId } = req.params;
  
      const colabs = await Colab.find({ $or: [{ receiver: requestId }, { sender: requestId }], status: { $in: ["active", "ended"] }  })
        .sort({ status: 1, dateAccepted: -1 })
        .populate("sender", "fullName username")
        .populate("receiver", "fullName username");
  
      res.status(200).json({ colabs });
    } 
    
    catch (error) {
      console.error("getColabs error:", error);
      res.status(500).json({ message: "Failed to fetch colabs." });
    }
  };

export const endColab = async (req, res) => {
    try {
      const { requestId } = req.params;
      const request = await Colab.findByIdAndUpdate(
        requestId,
        {
          status: "ended",
          dateEnded: new Date(), 
        },
        { new: true }
      );
  
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
  
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  };




  