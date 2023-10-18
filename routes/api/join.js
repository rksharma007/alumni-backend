const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;

// Import authentication validators
const authAdmin = require("../../middleware/authAdmin");

const MemberAlumni = require("../../models/MemberAlumni");
const MemberStudent = require("../../models/MemberStudent");

// @route    POST api/join/alumni
// @desc     Post a join as alumni request
// @access   Public
router.post(
  "/alumni",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("phone", "Please enter a valid phone number").isLength({ min: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      email,
      phone,
      batch,
      course,
      passingYear,
      branch,
      roll,
      position,
      medal,
      achievements,
      higherStudies1,
      higherStudies2,
      higherStudies3,
      workExperience1,
      workExperience2,
      workExperience3,
      currentOrganisation,
    } = req.body;

    const emailPresent = await MemberAlumni.find({ email: email });
    if(emailPresent.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Email already exists" }] });
    }

    try {
      const member = new MemberAlumni({
        name,
        email,
        phone,
        batch,
        course,
        passingYear,
        branch,
        roll,
        position,
        medal,
        achievements,
        higherStudies1,
        higherStudies2,
        higherStudies3,
        workExperience1,
        workExperience2,
        workExperience3,
        currentOrganisation,
      });

      await member.save();
      res.send(member);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    POST api/join/student
// @desc     Post a join as current student request
// @access   Public
router.post(
  "/student",
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("phone", "Please enter a valid phone number").isLength({ min: 10 }),
    check("batch", "batch cannot be empty").not().isEmpty(),
    check("course", "course cannot be empty").not().isEmpty(),
    check("branch", "branch cannot be empty").not().isEmpty(),
    check("roll", "roll cannot be empty").not().isEmpty(),
    check("passingYear", "position cannot be empty").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, batch, course, passingYear, branch, roll } =
      req.body;

    const emailPresent = await MemberStudent.find({ email: email });
    if(emailPresent.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Email already exists" }] });
    }

    try {
      const member = new MemberStudent({
        name,
        email,
        phone,
        batch,
        course,
        passingYear,
        branch,
        roll,
      });

      await member.save();
      res.send(member);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    GET api/join/student
// @desc     Get all student members
// @access   Private
router.get("/student", authAdmin, async (req, res) => {
    try {
        const members = await MemberStudent.find();
        res.send(members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route    GET api/join/alumni
// @desc     Get all alumni members
// @access   Private
router.get("/alumni", authAdmin, async (req, res) => {
    try {
        const members = await MemberAlumni.find();
        res.send(members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
module.exports = router;
