import { Router } from "express";
import { getYourTeamDetails, signIn, signOut, signUp } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/sign-out", signOut);
router.get("/team-details", verifyToken, getYourTeamDetails);


export default router;