const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require ('cors');
const knex =require ('knex');
const path = require("path");


const register =require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


//const PORT = process.env.PORT || 3001 ;



const db = knex({
    client: 'pg',
    connection: {
    //     host: '127.0.0.1',
    //     user: 'gulbadam',
    //     password: '',
    //     database: 'mopedb'
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.get('/', (req, res) => res.send("working"));

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})
app.post('/colors',  (req, res) => {image.handleApiColors(req, res)})
app.post('/demographics',  (req, res) => {image.handleApiDemographics(req, res)})
app.post('/general',  (req, res) => {image.handleApiGeneral(req, res)})
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id',  (req, res) => { profile.handleProfileGet(req, res, db)})

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});