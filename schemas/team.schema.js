import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    }
  ],

  wins:      { type: Number, default: 0 },
  draws:     { type: Number, default: 0 },
  losses:    { type: Number, default: 0 },
  goalsFor:  { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  points:    { type: Number, default: 0 },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Team = mongoose.model("Team", TeamSchema);

export default Team;