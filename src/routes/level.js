const express = require("express");

let router = express.Router();

router.get("/", (req, res) =>{
    res.json({'milestone': req.session.milestoneLevel});
});

module.exports = router;