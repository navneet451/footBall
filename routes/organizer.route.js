import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyOrganizer } from "../middlewares/organizer.middleware.js";
import { createTeam, getAllPlayers, getAllTeams } from "../controllers/organizer.controller.js";

const router = Router();

router.post("/organizer/team", [verifyToken, verifyOrganizer], createTeam);
router.get("/organizer/players", [verifyToken, verifyOrganizer], getAllPlayers);
router.get("/organizer/teams", [verifyToken, verifyOrganizer], getAllTeams);


export default router;