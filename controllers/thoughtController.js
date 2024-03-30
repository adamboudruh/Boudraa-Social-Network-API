const { User, Thought } = require('../models');

module.exports = {

  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('reactions');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: 'Thought created, but no user with matching ID found',
        });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user and associated apps
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
        const result = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, 
            { 
            thoughtText: req.body.thoughtText, 
            username: req.body.username,
            },
            { new: true }
        );
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID'});
        }
        res.status(200).json(result);
        console.log(`Updated: ${result}`);
    } catch (err) {
        res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
        const reaction = await Thought.findByIdAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } }
        );
        res.json(reaction);
    } catch (err) {
        res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
        const reaction = await Thought.findByIdAndRemove(
            { _id: req.params.thoughtId },
            { $pull: { reactions: req.params.reactionId } }
        );
        if (!reaction) {
            return res.status(404).json({ message: 'No thought with that ID'});
        }
        res.json(reaction);
    } catch (err) {
        res.status(500).json(err);
    }
  }
};
