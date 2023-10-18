const mongoose = require('mongoose');

const MemberAlumniSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
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
    phone:{
        type: String,
        required: true,
    },
    passingYear:{
        type: String,
        required: true,
    },
    position:{
        type: String,
    },
    medal:{
        type: String,
    },
    achievements:{
        type: String,
    },
    higherStudies1:{
        type: String,
    },
    higherStudies2:{
        type: String,
    },
    higherStudies3:{
        type: String,
    },
    workExperience1:{
        type: String,
    },
    workExperience2:{
        type: String,
    },
    workExperience3:{
        type: String,
    },
    currentOrganisation:{
        type: String,
    },

}, {timestapms: true});

module.exports = MemberAlumni = mongoose.model('alumni', MemberAlumniSchema);