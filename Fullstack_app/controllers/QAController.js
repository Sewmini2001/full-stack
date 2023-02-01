const router = require('express').Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Feedback } = require('../models/QA');

// => localhost:3000/qafeedback/
router.get('/', (req, res) => {
    Feedback.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Question & Feedback :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

    Feedback.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Question & Feedback :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    var feed = new Feedback({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
    });
    feed.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Question & Feedback Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

    var feed = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
    };
    Feedback.findByIdAndUpdate(req.params.id, { $set: feed }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Question & Feedback Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

    Feedback.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Question & Feedback Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;