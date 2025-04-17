import cloudinary from"../lib/cloudinary.js"
import User from "../models/user.model.js";
import Portfolio from "../models/portfolio.model.js";
import Follow from "../models/follower.model.js";

export const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select(
      "email username fullName profilePic bio authenticatedEmail role status location lastLogin numberOfFollowers numberofFollowing"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }  
    res.status(200).json(user);
  } 
  
  catch (error) {
    console.log("Error in getProfileByUsername:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } 
  
  catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editProfileDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, location, status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, location, status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);

  } 
  
  catch (error) {
    console.log("Error in editProfileDetails:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
  
export const createPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, externalLink, images, type } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (images && Array.isArray(images) && images.length > 25) {
      return res.status(400).json({ message: "Maximum 25 images allowed" });
    }

    const uploadedImages = [];

    if (images && Array.isArray(images)) {

      for (let image of images) {
        const uploaded = await cloudinary.uploader.upload(image, {
          folder: "portfolio-images",
        });
        uploadedImages.push(uploaded.secure_url);
      }
    }

    const newPortfolio = new Portfolio({
      userId,
      title,
      description,
      externalLink,
      images: uploadedImages,
      type
    });

    await newPortfolio.save();

    res.status(201).json({ message: "Portfolio created successfully", portfolio: newPortfolio });
    
  } catch (error) {
    console.error("Error in createPortfolio:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPortfoliosByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const portfolios = await Portfolio.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(portfolios);
  } 
  
  catch (error) {
    res.status(500).json({ message: "Error fetching portfolios", error });
  }
};

export const followUser = async (req, res) => {
  const { userIdToFollow } = req.body;
  const followerId = req.user._id;

  if (followerId.toString() === userIdToFollow) {
    return res.status(400).json({ message: "You cannot follow yourself." });
  }

  try {
    const targetUser = await User.findById(userIdToFollow);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const follow = new Follow({
      follower: followerId,
      following: userIdToFollow,
    });

    await follow.save();
    res.status(201).json({ message: "Followed successfully." });
  } 
  
  catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already following." });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to follow user." });
  }
};

export const unfollowUser = async (req, res) => {
  const { userIdToUnfollow } = req.body;
  const unfollowerId = req.user._id;

  if (unfollowerId.toString() === userIdToUnfollow) {
    return res.status(400).json({ message: "You cannot unfollow yourself." });
  }

  try {
    const targetUser = await User.findById(userIdToUnfollow);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const follow = await Follow.findOneAndDelete({
      follower: unfollowerId,
      following: userIdToUnfollow,
    });

    if (!follow) {
      return res.status(404).json({ message: "You are not following this user." });
    }
    res.status(200).json({ message: "Unfollowed successfully." })
  } 
  
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unfollow user." });
  }
};

export const checkIsFollowing = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user._id; 

    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: targetUserId,
    });
    res.status(200).json({ isFollowing: !!existingFollow });
  }   
  catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
}

export const getNumberOfFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Follow.countDocuments({ following: userId });
    res.status(200).json({ followersCount: count });
  } 
  
  catch (error) {
    console.error("Error in getNumberOfFollowers:", error);
    res.status(500).json({ message: "Server error while fetching followers count." });
  }
};

export const getNumberOfFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const followingCount = await Follow.countDocuments({ follower: userId });
    res.status(200).json({ numberOfFollowing: followingCount });
  } 
  
  catch (error) {
    console.error("Error in getNumberOfFollowing:", error);
    res.status(500).json({ message: "Server error while fetching following count." });
  }
};

export const getFollowingPeople = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId })
      .populate("following", "username fullName profilePic role");
    res.json(following.map(f => f.following));
  } 
  
  catch (error) {
    console.error("Error in getFollowingPeople:", error);
    res.status(500).json({ message: "Error fetching following" });
  }
}

export const getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate("follower", "username fullName profilePic role");
    res.json(followers.map(f => f.follower));
  } 
  
  catch (error) {
    console.error("Error in getFollowers:", error);
    res.status(500).json({ message: "Error fetching followers" });
  }
}


