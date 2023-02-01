const mongoose = require('mongoose');

var Feedback = mongoose.model('Feedback', {
    fname: { type: String },
    lname: { type: String },
    email: { type: String },
    subject: { type: String },
    message: { type: String },
});

module.exports = { Feedback } ;