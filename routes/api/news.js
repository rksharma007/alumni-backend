const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;

// Import authentication validators
const authAdmin = require("../../middleware/authAdmin");
const News = require("../../models/News");

// @route    POST api/news
// @desc     Post a news
// @access   Private
router.post(
  "/add",
  authAdmin,
  [
    check("title", "Title cannot be empty").not().isEmpty(),
    check("description", "Please enter a valid description").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title, description, link, date
    } = req.body;

    try {
      const news = new News({
        title, description, link, date
      });

      await news.save();
      res.send(news);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


// @route    GET api/news
// @desc     Get all news
// @access   Public
router.get("/all", async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/news/:id
// @desc    Delete a news
// @access  Private
router.delete("/news/:id", authAdmin, async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const news = await News.findById(id);
    
        if (!news) {
        return res.status(404).json({ msg: "News not found" });
        }
    
        await News.findByIdAndRemove(id);
        res.json({ msg: "News removed" });
    } catch (err) {
        console.error(err.message);
    
        res.status(500).send("Server error");
    }
    });

module.exports = router;
