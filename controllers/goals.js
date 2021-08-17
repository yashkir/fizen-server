const uuid = require('uuid');
const debug = require('debug')('api');
const Goal = require('../models/goal');

function update(req, res) {
  res.send("empty");
}

/* ------------------------------------------
 * Authentication required for the following:
 * ------------------------------------------ */

/**
 * Creates a new Goal from req.body.
 *
 * Replies with the { goal }
 */
async function create(req, res) {
  try {
    req.body.user = req.user._id;

    const newGoal = await Goal.create(req.body);
    return res.status(200).json({ goal: newGoal });
  } catch (err) {
    debug(err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Lists all of current user's goals.
 *
 * Replies with{ goals[] }
 */
async function index(req, res) {
  try {
    const goals = await Goal.find({ user: req.user._id });

    return res.status(200).json({ goals });
  } catch (err) {
    debug(err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Shows one Goal from params.goalId
 *
 * Replies with the { goal }
 */
async function show(req, res) {
  try {
    const goal = await Goal.findById(req.params.goalId);

    if (goal === null) {
      return res.status(404).json({ message: "Goal not found." });
    }

    return res.status(200).json({ goal });
  } catch (err) {
    debug(err);

    if (err.name == "CastError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  }
}

/**
 * Updates a goal using req.body
 *
 * Replies with status(200)
 */
async function update(req, res) {
  try {
    const goal = await Goal.findById(req.params.goalId);

    if (goal === null) {
      return res.status(404).json({ message: "Goal not found." });
    }

    // Only allow deletion of own goals
    if (String(req.user._id) === String(goal.user._id)) {
      const result = await Goal.updateOne(goal, req.body);
      return res.status(200).json(result);
    } else {
      return res.status(403).json({ "message": "You can only update your own goals." });
    }
  } catch (err) {
    debug(err);

    if (err.name == "CastError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  }
}

/**
 * Deletes a goal by req.params.goalId
 *
 * Replies with status(200)
 */
async function _delete(req, res) {
  try {
    const goal = await Goal.findById(req.params.goalId);

    if (goal === null) {
      return res.status(404).json({ message: "Goal not found." });
    }

    // Only allow deletion of own goals
    if (String(req.user._id) === String(goal.user._id)) {
      const result = await Goal.deleteOne(goal);
      return res.status(200).json(result);
    } else {
      return res.status(403).json({ "message": "You can only delete your own goals." });
    }
  } catch (err) {
    debug(err);

    if (err.name == "CastError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  create,
  index,
  show,
  update,
  delete: _delete,
}
