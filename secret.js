import dotenv from "dotenv";

if (process.env.NODE_ENV != "production") {
    dotenv.config({ path: ".env" });
}


export const PORT = process.env.PORT;
export const JWTSECRETS = process.env.JWT_SECRETS;
export const MONGOURI=process.env.MONGO_URI;