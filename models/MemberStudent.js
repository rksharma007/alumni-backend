const mongoose = require('mongoose');

const MemberStudentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    roll:{
        type: String,
        required: true,
    },
    branch:{
        type: String,
        required: true,
    },
    batch:{
        type: String,
        required: true,
    },
    course:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: String,
        required: true,
    },
    passingYear:{
        type: String,
        required: true,
    },
}, {timestapms: true});

module.exports = MemberStudent = mongoose.model('student', MemberStudentSchema);