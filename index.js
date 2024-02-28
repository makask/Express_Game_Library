import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const API_KEY = process.env.API_KEY;
let gameCounter = 0;
let toggler = false;

async function sortBy(input){
    toggler = !toggler;
    let result = {};
    if(toggler){
        result = await db.query("SELECT * FROM games ORDER BY " + input + " ASC");
    }else{
        result = await db.query("SELECT * FROM games ORDER BY " + input + " DESC");
    }
    return result;
}

// GET all games
app.get("/", async (req, res) => {
    try{
        const type = req.query.type;
        let sort = req.query.sort;
        let result = {};
        if(type){
            result = await db.query("SELECT * FROM games WHERE genre=$1", [type]);
        }else if(sort){
            result = await sortBy(sort);
        }
        else{
            result = await db.query("SELECT * FROM games");
            gameCounter = result.rows.length;
        }
        res.render("index.ejs", { games : result.rows, gameCounter : gameCounter });
    }catch(err){
        console.log(err);
    }
});

app.get("/game/:id", async (req, res) => {
    try{
        const gameId = req.params.id;
        const result = await db.query("SELECT * FROM games WHERE id = $1", [gameId]);
        res.render("game.ejs", { game : result.rows[0]});
    }catch(err){
        console.log(err);
    }
});

app.get("/gameslist", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM games ORDER BY title ASC");
        gameCounter = result.rows.length;
        res.render("gameslist.ejs", { games : result.rows, gameCounter : gameCounter });
    }catch(err){
        console.log(err);
    }
});

app.get("/admin", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM games");
        res.render("admin.ejs", { games : result.rows });
    }catch(err){
        console.log(err);
    }
});

app.get("/admin/add", (req, res) => {
    res.render("add.ejs");
});

app.post("/admin/get-data", async (req, res) => {
    try{
        const searchTitle = req.body.search;
        const response = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&search=${searchTitle}`);
        const gameData = {
            title : response.data.results[0].name,
            releaseDate : response.data.results[0].released,
            imageURL : response.data.results[0].background_image,
            metacritic : response.data.results[0].metacritic
        }
        res.render("add.ejs", { data : gameData });
    }catch(err){
        console.log(err);
    }
});

app.post("/admin/add", async (req, res) => {
    try{
        await db.query("INSERT INTO games (title, release_date, picture_url, description, review, genre, metacritic, my_rating) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
        [req.body.title, req.body.date, req.body.pictureURL,req.body.description, req.body.review, req.body.genre, req.body.metacritic, req.body.myRating]);
        res.redirect("/admin");
    }catch(err){
        console.log(err);
    }
});

app.get("/admin/edit/:id", async (req, res) => {
    try{
        const gameId = req.params.id;
        const result = await db.query("SELECT * FROM games WHERE id = $1", [gameId]);
        res.render("edit.ejs", { game : result.rows[0]} );
    }catch(error){
        console.log(err);
    }
});

// Update game
app.post("/admin/edit/game", async (req, res) => {
    try{
        await db.query("UPDATE games SET title = $1, release_date = $2, picture_url = $3, description = $4, review = $5, genre = $6, metacritic = $7, my_rating = $8 WHERE id = $9",
        [req.body.updatedTitle, req.body.updatedDate, req.body.updatedPicture, req.body.updatedDescription, req.body.updatedReview, req.body.updatedGenre, 
        req.body.updatedMetacritic, req.body.updatedMyRating, req.body.updatedGameId]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

// Delete game
app.post("/admin/delete/:id", async (req, res) => {
    console.log(req.params.id);
    try{
        await db.query("DELETE FROM games WHERE id = $1", [req.params.id]);
        res.redirect("/admin");
    }catch(err){
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  