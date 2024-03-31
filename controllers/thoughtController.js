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
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
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

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      const result = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true}
      )

      res.json(result)
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
        const result = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, 
            { 
            thoughtText: req.body.thoughtText
            },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ message: 'No thought with that ID'});
        }
        res.status(200).json(result);
    } catch (err) {
      console.log(err);
        res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
        const reaction = await Thought.findByIdAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true}
        );
        res.json(reaction);
    } catch (err) {
        res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
        const reaction = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            {new: true}
        );
        if (!reaction) {
            return res.status(404).json({ message: 'No thought with that ID'});
        }
        res.status(200).json(reaction);
    } catch (err) {
        res.status(500).json(err);
    }
  }
};