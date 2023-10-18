const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    link:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now(),
    },
});

module.exports = News = mongoose.model('news', NewsSchema);