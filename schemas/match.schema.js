import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },

  opponentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },

  teamScore:       { type: Number, required: true },
  opponentScore:   { type: Number, required: true },

  status: {
    type: String,
    enum: ["completed", "upcoming"],
    default: "completed",  
  },

  date: { type: Date, default: Date.now }
});

const Match = mongoose.model("Match", MatchSchema);

export default Match;
