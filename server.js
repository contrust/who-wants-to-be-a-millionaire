const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");
const session = require('express-session');
const constrains = require("./src/configs/constains.js");
const isUserPlaying = require("./src/middlewares/isUserPlaying.js");
const gameRouter = require('./src/routes/game.js');
const handlebarsRouter = require('./src/routes/handlebars.js');
const hintsRouter = require('./src/routes/hints.js');
const milestoneRouter = require('./src/routes/level.js');
const questionRouter = require('./src/routes/question.js');
const scoreRouter = require('./src/routes/score.js');


const app = express();


app.use('/public', express.static('./public'));
app.engine("hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: "views/layouts",
        partialsDir: "views/partials",
    })
);
app.set("view engine", "hbs");

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "7&NT0c#_myc9!!p[==_",
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.use('/', handlebarsRouter);
app.use('/api/question', questionRouter);
app.use('/api/score', scoreRouter);
app.use('/api/game', gameRouter);
app.use('/api/', isUserPlaying);
app.use('/api/hints', hintsRouter);
app.use('/api/milestone', milestoneRouter);

app.get("/", (_, res) => {
    res.redirect('/start');
});

app.listen(process.env.PORT || constrains.port, () => console.log(`App listening on port ${constrains.port}`));

