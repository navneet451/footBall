import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    required: true,
    default: "player",
    enum: ["player","organizer"]
  },

  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

export default User;