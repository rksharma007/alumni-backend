const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        default: 'admin',
    }
}, {timestapms: true});

module.exports = Admin = mongoose.model('admin', AdminSchema);