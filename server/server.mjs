import express from "express";
import hbs from "express-handlebars";
import path from "path";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.set("view engine", "hbs");
app.engine(
    "hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "../views/layouts/"),
        partialsDir: path.join(rootDir, "../views/partials/"),
    })
);