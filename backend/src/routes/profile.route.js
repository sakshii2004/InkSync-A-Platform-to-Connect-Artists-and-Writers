import express from "express";
import { getProfileByUsername, editProfilePic, editProfileDetails, 
    createPortfolio, getPortfoliosByUser, 
    followUser , checkIsFollowing, 
    getNumberOfFollowers, getNumberOfFollowing, 
    unfollowUser, getFollowingPeople,
    getFollowers
 } from "../controllers/profile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:username", protectRoute, getProfileByUsername);
router.put("/edit-profile-pic", protectRoute, editProfilePic);
router.put("/edit-profile-details", protectRoute, editProfileDetails);
router.post("/add-portfolio", protectRoute, createPortfolio);
router.get("/portfolio/:userId", protectRoute, getPortfoliosByUser);
router.post("/follow", protectRoute, followUser);
router.post("/unfollow", protectRoute, unfollowUser);
router.get("/is-following/:targetUserId", protectRoute, checkIsFollowing);
router.get("/followers-count/:userId", protectRoute, getNumberOfFollowers);
router.get("/following-count/:userId", protectRoute, getNumberOfFollowing);
router.get("/following-count/:userId", protectRoute, getNumberOfFollowing);
router.get("/:userId/following", protectRoute, getFollowingPeople);
router.get("/:userId/followers", protectRoute, getFollowers);



export default router;
