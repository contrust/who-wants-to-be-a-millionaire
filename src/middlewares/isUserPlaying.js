function isUserPlaying(req, res, next) {
    if (req.session.isPlaying) next();
    else res.status(404)
        .send("You can not do this request when you are not playing.");
}

module.exports = isUserPlaying;