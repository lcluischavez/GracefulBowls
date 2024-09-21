const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require('lodash');
const mongoose = require("mongoose");
const path = require('path');
const session = require('express-session');
const passport = require('passport');
passportLocalMongoose = require('passport-local-mongoose')
const methodOverride = require('method-override');
const { stringify } = require("querystring");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).single('file');
const app = express();
const pool = require('./db');
const fs = require("node:fs", "fs");
const mailgun = require('mailgun-js');



app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
  secret: "Our little secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

const userSchema = new mongoose.Schema ({
    email: String,
    password: String,

});

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const homeStartingContent = "";
const aboutContent = " about zach";
const contactContent = "contact zach";

//ROUTES

//redirect home if not logged in
app.get('/', function (req,res){
  if(req.isAuthenticated()){
    res.redirect('/adminhome')

  }else{

    res.redirect('/home')
  }

})

app.get("/home", function(req,res){   
    res.render('home') 
});

app.get("/aboutus", function(req,res){   
    res.render('about')
});

app.get("/contact", function(req,res){
    res.render('contact')
});

app.get('/menu', function(req,res){
    res.render('menu')
});














const DOMAIN = 'postmaster@sandboxa0edc30416d74ce2add03eecae4a4876.mailgun.org'; // Replace with your Mailgun domain
const mg = mailgun({ apiKey: 'dbeb632da9dbfbc721f7ce9416c2ff5a', domain: DOMAIN });

// Middleware to parse incoming request data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint to send emails
app.post('/send-email', (req, res) => {
  const { name, email, subject, message } = req.body;

  const data = {
    from: `${name} <${email}>`,
    to: 'directorsletters.contact@gmail.com', // Replace with your email address to receive messages
    subject: subject,
    text: message,
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    console.log('Email sent:', body);
    res.json({ message: 'Email sent successfully' });
  });
});

// Endpoint to receive emails (Webhook route)
app.post('/incoming-email', (req, res) => {
  // Handle incoming emails here
  console.log('Received email:', req.body);
  res.sendStatus(200);
});















///sql connection
const db = require('./db');

db.query('SELECT * FROM directors_letters_db.lettercategories', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('Query results:', results.rows);
});



const PORT = process.env.PORT || 3100





app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});