import Match from "../schemas/match.schema.js";
import Team from "../schemas/team.schema.js";

export const getAllLiveMatch = async (req, res, next) => {
  try {
    const liveMatches = await Match.find({ status: "live" })
      .populate("team", "name")
      .populate("opponentTeam", "name")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: liveMatches.length,
      matches: liveMatches,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCompletedMatch = async (req, res, next) => {
  try {
    const completedMatches = await Match.find({ status: "completed" })
      .populate("team", "name")
      .populate("opponentTeam", "name")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: completedMatches.length,
      matches: completedMatches,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLiveScore = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const { teamScore, opponentScore } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    if (match.status !== "live") {
      return res.status(400).json({ success: false, message: "Match is not live" });
    }

    // calculate deltas
    const teamScoreDiff = teamScore - match.teamScore;
    const opponentScoreDiff = opponentScore - match.opponentScore;

    // update match score
    match.teamScore = teamScore;
    match.opponentScore = opponentScore;
    await match.save();

    // update team stats
    if (teamScoreDiff !== 0) {
      await Team.findByIdAndUpdate(match.team, {
        $inc: {
          goalsFor: teamScoreDiff,
          goalsAgainst: 0,
        },
      });

      await Team.findByIdAndUpdate(match.opponentTeam, {
        $inc: {
          goalsFor: 0,
          goalsAgainst: teamScoreDiff,
        },
      });
    }

    if (opponentScoreDiff !== 0) {
      await Team.findByIdAndUpdate(match.opponentTeam, {
        $inc: {
          goalsFor: opponentScoreDiff,
          goalsAgainst: 0,
        },
      });

      await Team.findByIdAndUpdate(match.team, {
        $inc: {
          goalsFor: 0,
          goalsAgainst: opponentScoreDiff,
        },
      });
    }

    res.status(200).json({
      success: true,
      match,
    });
  } catch (error) {
    next(error);
  }
};

export const completeMatch = async (req, res, next) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId)
      .populate("team")
      .populate("opponentTeam");

    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    if (match.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Match already completed" });
    }

    const team = match.team;
    const opponent = match.opponentTeam;

    // decide result
    if (match.teamScore > match.opponentScore) {
      // team wins
      await Team.findByIdAndUpdate(team._id, {
        $inc: { wins: 1, points: 3 },
      });
      await Team.findByIdAndUpdate(opponent._id, {
        $inc: { losses: 1 },
      });
      match.winner = team.name;
    } else if (match.opponentScore > match.teamScore) {
      // opponent wins
      await Team.findByIdAndUpdate(opponent._id, {
        $inc: { wins: 1, points: 3 },
      });
      await Team.findByIdAndUpdate(team._id, {
        $inc: { losses: 1 },
      });
      match.winner = opponent.name;
    } else {
      // draw
      await Team.findByIdAndUpdate(team._id, {
        $inc: { draws: 1, points: 1 },
      });
      await Team.findByIdAndUpdate(opponent._id, {
        $inc: { draws: 1, points: 1 },
      });
      match.winner = "Draw";
    }

    match.status = "completed";
    await match.save();

    res.status(200).json({
      success: true,
      match,
    });
  } catch (error) {
    next(error);
  }
};


export const getMatchDetails = async (req, res, next) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId)
      .populate({
        path: "team",
        select: "name players wins losses draws goalsFor goalsAgainst points",
        populate: {
          path: "players",
          select: "fullName",
        },
      })
      .populate({
        path: "opponentTeam",
        select: "name players wins losses draws goalsFor goalsAgainst points",
        populate: {
          path: "players",
          select: "fullName",
        },
      });

    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    res.status(200).json({
      success: true,
      match,
    });
  } catch (error) {
    next(error);
  }
};