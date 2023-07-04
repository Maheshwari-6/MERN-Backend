const express = require('express');
const route = require ('./config/route');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cookieParser())

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials:true
}))

//Set EJS as a view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Use CSS,JS
app.use('/public', express.static('public'));

//require mongoose
require('./config/mongo');

//Make app use the route
app.use(route);

let PORT = 2390;
app.listen(PORT, () => console.log(`Server on ${PORT}`));