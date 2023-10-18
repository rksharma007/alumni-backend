const mongoose = require('mongoose');

const EventsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default: 'https://via.placeholder.com/640x480',
        required: true,
    },
    time:{
        type: String,
        required: true,
    },
    venue:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now(),
        required: true
    }
});

module.exports = Events = mongoose.model('events', EventsSchema);