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

  teamScore:       { type: Number, required: true, default: 0},
  opponentScore:   { type: Number, required: true, default: 0},

  status: {
    type: String,
    enum: ["completed", "live"],
    default: "live",  
  },
  winner: {type: String},

  date: { type: Date, default: Date.now }
});

const Match = mongoose.model("Match", MatchSchema);

export default Match;
