import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyOrganizer } from "../middlewares/organizer.middleware.js";
import { createMatch, createTeam, getAllPlayers, getAllTeams, getAllTeamDetails } from "../controllers/organizer.controller.js";

const router = Router();

router.post("/organizer/team", [verifyToken, verifyOrganizer], createTeam);
router.get("/organizer/players", [verifyToken, verifyOrganizer], getAllPlayers);
router.get("/organizer/teams", [verifyToken, verifyOrganizer], getAllTeams);
router.post("/organizer/match", [verifyToken, verifyOrganizer], createMatch);
router.get("/organizer/teamdetails", [verifyToken, verifyOrganizer], getAllTeamDetails);


export default router;