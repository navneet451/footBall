import { Router } from "express";
import { completeMatch, getAllCompletedMatch, getAllLiveMatch, getMatchDetails, updateLiveScore } from "../controllers/match.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyOrganizer } from "../middlewares/organizer.middleware.js";

const router = Router();

router.get("/liveMatch", getAllLiveMatch);
router.get("/completedMatch", getAllCompletedMatch);
router.get("/match/:matchId", getMatchDetails);
router.put("/match/:matchId/score", [verifyToken, verifyOrganizer], updateLiveScore);
router.put("/match/:matchId/complete", [verifyToken, verifyOrganizer], completeMatch);

export default router;