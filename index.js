import express from "express";
import { MONGOURI, PORT } from "./secret.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import organizerRouter from "./routes/organizer.route.js";
import mongoose from "mongoose";


const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/test", (req,res)=>{
  res.send("hello world");
})

app.use("/api/auth", userRouter);
app.use("/api", organizerRouter);


main()
  .then((res) => {
    console.log("Connected! to mongo_DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGOURI);
}


app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  // let success = err.success || false
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error: err,
  });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})