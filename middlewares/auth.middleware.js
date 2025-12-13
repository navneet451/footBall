import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import { JWTSECRETS } from "../secret.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);
  
  if (!token) {
    return next(errorHandler(401, "You are not loggedin!"));
  }
  jwt.verify(token, JWTSECRETS, (err, user) => {
    if (err) {
      return next(errorHandler(401, "You are not loggedin!"));
    }
    // console.log(user);
    req.user = user;
    next();
  });
};
