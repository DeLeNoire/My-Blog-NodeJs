//Load environment variables from .env file
require('dotenv').config();

//importing required modules
const express = require('express');
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
// const session = require('express-session')
const MongoStore = require('connect-mongo')

const connectDB = require('./server/config/db')
const session = require("express-session");
const {isActiveRoute} = require('./server/helpers/routerHelper')

//creating an instance of express application
const app = express()

//define port number where server will listen
const PORT = 3001 || process.env.PORT;

connectDB();

//pass data
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}))

app.use(express.static('public'))

//templating engine
app.use(expressLayout);                   //integrate express-ejs-layouts middleware with express app to enable layout support
app.set('layout' , './layouts/main')      //specifying default layout file foe views
app.set('view engine' , 'ejs')            //set the view engine to ejs(all the ejs extensions is use for dynamic content)


app.locals.isActiveRoute = isActiveRoute;

app.use('/' , require('./server/routes/main'))   //routing logic routing handler default in main
app.use('/' , require('./server/routes/admin'))

app.listen(PORT , () => {
    console.log(`Listening ${PORT}`)
})
