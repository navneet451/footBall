import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyOrganizer } from "../middlewares/organizer.middleware.js";
import { createTeam, getAllPlayers } from "../controllers/organizer.controller.js";

const router = Router();

router.post("/organizer/team", [verifyToken, verifyOrganizer], createTeam);
router.get("/organizer/players", [verifyToken, verifyOrganizer], getAllPlayers);
// router.post("/organizer/create");


export default router;