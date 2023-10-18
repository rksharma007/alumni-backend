const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;

// Import authentication validators
const authAdmin = require("../../middleware/authAdmin");
const Events = require("../../models/Events");

// @route    POST api/events
// @desc     Post an event
// @access   Private
router.post(
  "/new",
  authAdmin,
  [
    check("name", "Name cannot be empty").not().isEmpty(),
    check("description", "Please enter a valid description").not().isEmpty(),
    check("date", "Please enter a valid date").not().isEmpty(),
    check("time", "Please enter a valid time").not().isEmpty(),
    check("venue", "Please enter a valid venue").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, date, time, venue, image, description } = req.body;

    try {
      const event = new Events({
        name,
        date,
        time,
        venue,
        image,
        description,
      });

      await event.save();
      res.send(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    GET api/events
// @desc     Get all events
// @access   Public
router.get("/all", async (req, res) => {
  try {
    const events = await Events.find();
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const event = await Events.findById(id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    await Events.findByIdAndRemove(id);
    res.json({ msg: "Event removed" });
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server error");
  }
});

module.exports = router;
