import mongoose from "mongoose";


const PlayerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  fullName: { type: String, required: true },
});

const Player = mongoose.model("PLayer", PlayerSchema);

export default Player;