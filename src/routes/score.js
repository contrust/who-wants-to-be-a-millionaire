const express = require("express");

let router = express.Router();

router.get("/", (req, res) => {
    res.json({"currentScore": req.session.score});
});

module.exports = router;