import { errorHandler } from "../utils/errorHandler.js";

export const verifyOrganizer = (req, res, next) => {
    try {
        const {user} = req;
        console.log(user);
        if(user.role != "organizer"){
            return next(errorHandler(401, "you are not allowed to do this"));
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"server error"});
    }
}