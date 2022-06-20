const express = require("express");
const fiftyFifty = require("../controllers/hints/fiftyFify.js");
const randomArray = require("../utils/random/array.js");
const storageObjects = require("../storage/objects.js");
const friendCall = require("../controllers/hints/friendCall.js");
const constrains = require('../configs/constains.js');


let router = express.Router();

router.get("/fiftyFifty", (req, res) => {
    let fiftyFiftyAnswer = null;
    if (!req.session.isFiftyFiftyUsed){
        fiftyFiftyAnswer = fiftyFifty.getFiftyFiftyAnswer(req);
        fiftyFifty.removeIncorrectAnswers(req, fiftyFiftyAnswer);
        req.session.isFiftyFiftyUsed = true;
    }
    res.json({"fiftyFiftyAnswer": fiftyFiftyAnswer});
});

router.get("/friendCall", (req, res) => {
    let friendCallAnswer = null;
    if (!req.session.isFriendCallUsed) {
        let template = randomArray.getRandomArrayElement(storageObjects.getFriendCallTemplates(req.session.difficulty));
        let answer = friendCall.getFriendCallAnswer(req.session.currentQuestion, constrains.friendCallRightAnswerProbability[req.session.difficulty]);
        friendCallAnswer = friendCall.getFormattedFriendCallAnswer(template, answer);
        req.session.isFriendCallUsed = true;
    }
    res.json({"friendCallAnswer": friendCallAnswer});
});

module.exports = router;