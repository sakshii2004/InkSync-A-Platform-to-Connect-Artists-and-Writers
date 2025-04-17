import express from "express";
import { sendColabRequest, getSentRequests, getReceivedRequests, acceptRequest, getColabs, declineRequest, withdrawRequest, endColab } from "../controllers/colab.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-request", protectRoute, sendColabRequest);
router.get("/sent-requests", protectRoute, getSentRequests);
router.get("/received-requests", protectRoute, getReceivedRequests);
router.put("/accept/:requestId", protectRoute, acceptRequest);
router.put("/decline/:requestId", protectRoute, declineRequest);
router.put("/withdraw/:requestId", protectRoute, withdrawRequest);
router.get("/all-colabs/:requestId", protectRoute, getColabs);
router.put("/endcolab/:requestId", protectRoute, endColab);

export default router;
