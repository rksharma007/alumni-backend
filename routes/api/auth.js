const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { check, validationResult }= require('express-validator');

// Bring admin model
const Admin = require('../../models/Admin');

// Bring auth token
const authAdmin = require('../../middleware/authAdmin')

// @route    POST api/auth/register
// @desc     Register Admin
// @access   Public
router.post('/register', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be minimum 8 characters long').isLength({min: 8})
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array() });
        }

        const { email, password} = req.body;

        try{
            let admin = await Admin.findOne({ email });;
            // See if the admin exists
            if(admin){
                return res.status(400).json({ errors: [{msg: 'Admin with this email already exists'}]});
            }

            admin = new Admin({
                email,
                password,
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
            await admin.save();

            // Return jsonwebtoken
            const payload = {
                admin:{
                    id : admin.id
                }
            }

            jwt.sign(
                payload,
                process.env.JWTSECRETADMIN,
                { expiresIn: 360000 },
                (err, token) => {
                    if(err) throw err;
                    res.json({ token });
                }
            );

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


// @route    POST api/auth/login
// @desc     Authenticate admin & get token
// @access   Public
router.post('/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required!').exists(),
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array() });
        }

        const { email, password } = req.body;

        try{
            let admin = await Admin.findOne({ email });
            // See if the admin exists
            if(!admin){
                return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if(!isMatch){
                return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials!' }] });
            }
            
            const payload = {
                admin:{
                    id : admin.id
                }
            }

            jwt.sign(
                payload,
                process.env.JWTSECRETADMIN,
                { expiresIn: 360000 },
                (err, token) => {
                    if(err) throw err;
                    res.json({ token });
                }
            );

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route    PUT api/auth/changepassword
// @desc     Change password
// @access   Private
router.put('/changepassword',[
    check('newPassword', 'Password must be minimum 8 characters long').isLength({min: 8}),
    check('oldPassword', 'Current password is required').exists()
], authAdmin, async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const { newPassword, oldPassword } = req.body;
    try{
        const admin = await Admin.findOne({ _id: req.userId });
        if(!admin){
            return res.status(404).json({ msg: 'Account not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials!' }] });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();
        res.status(200).send('Password Updated Successfully');
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/admin/me
// @desc     Get logged in admin
// @access   Private
router.get('/me', authAdmin, async (req,res) => {
    try {
        const admin = await Admin.findOne({ _id: req.userId }).select('-password');
        res.send(admin);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;