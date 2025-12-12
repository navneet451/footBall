import Player from "../schemas/player.schema.js";
import Team from "../schemas/team.schema.js";

export const createTeam = async (req, res, next) => {
  try {
    const {teamName, players} = req.body;
    const team = new Team({
        name: teamName,
        players: players
    })
    await team.save();
    res.status(201).json({success: true, message: "team created", team});
  } catch (error) {
    console.log("Signup error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPlayers = async (req, res, next) => {
  try {
    const players = await Player.find();
    res.status(200).json({message:"players fetched successfully", players});
  } catch (error) {
    res.status(500).json({message:"server erroe", success:false});
  }
}

export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();
    return res.status(200).json({success: true, message:"team fetched successfully", teams});
  } catch (error) {
    res.status(500).json({message:"server erroe", success:false});
  }
}

export const updateScore = async (req, res, next) => {
  try {
    const {team, oppositeTeam, teamScore, oppositeTeamScore} = req.body;

  } catch (error) {
    
  }
}
