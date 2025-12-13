import mongoose from "mongoose";
import Player from "../schemas/player.schema.js";
import Team from "../schemas/team.schema.js";
import Match from "../schemas/match.schema.js";

export const createTeam = async (req, res, next) => {
  try {
    const { teamName, players } = req.body;
    const playerIds = players.map(id => new mongoose.Types.ObjectId(id));
    const team = new Team({
      name: teamName,
      players: playerIds,
    });

    await Player.updateMany(
      { _id: { $in: players } },
      { $set: { teamId: team._id } }
    );
    
    await team.save();
    res.status(201).json({ success: true, message: "team created", team });
  } catch (error) {
    console.log("Signup error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPlayers = async (req, res, next) => {
  try {
    const players = await Player.find();
    res.status(200).json({ message: "players fetched successfully", players });
  } catch (error) {
    res.status(500).json({ message: "server erroe", success: false });
  }
};

export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();
    return res
      .status(200)
      .json({ success: true, message: "team fetched successfully", teams });
  } catch (error) {
    res.status(500).json({ message: "server erroe", success: false });
  }
};

export const createMatch = async (req, res, next) => {
  try {
    const { team, opponent, teamScore, opponentScore } = req.body;
    const match = new Match({
      team,
      opponentTeam: opponent,
      teamScore,
      opponentScore,
    });
    await match.save();

    const teamA = await Team.findById(team);
    const teamB = await Team.findById(opponent);

    if (!teamA || !teamB) {
      return res
        .status(400)
        .json({ success: false, message: "Team not found" });
    }

    teamA.goalsFor += Number(teamScore);
    teamA.goalsAgainst += Number(opponentScore);

    teamB.goalsFor += Number(opponentScore);
    teamB.goalsAgainst += Number(teamScore);

    if (teamScore > opponentScore) {
      teamA.wins += 1;
      teamA.points += 3;
      teamB.losses += 1;
    } else if (teamScore < opponentScore) {
      teamB.wins += 1;
      teamB.points += 3;
      teamA.losses += 1;
    } else {
      teamA.draws += 1;
      teamB.draws += 1;
      teamA.points += 1;
      teamB.points += 1;
    }

    await teamA.save();
    await teamB.save();

    return res
      .status(201)
      .json({ success: true, message: "Match created", match });
  } catch (error) {
    res.status(500).json({ message: "server erroe", success: false });
  }
};

export const getAllTeamDetails = async (req, res, next) => {
  try {
    const teamDetails = await Team.find()
    .populate({
      path: "players",
      populate: {
        path: "userId",
        select: "fullName email",
      },
    }).exec();
    return res.status(200).json({
      success: true,
      message: "team details fetched successfully",
      teamDetails,
    });
  } catch (error) {
    console.log("Populate error", error.message);
    res.status(500).json({ message: "server erroe", success: false, error });
  }
};
