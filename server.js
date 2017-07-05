const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const async = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const mongoose = require('mongoose');


const app = express();

app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/mailerapp');
const db = mongoose.connection;

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "nmdjhfckfjhbfd",
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(flash());


//3b41263ec1bd0730ceb0c0b0101960bc-us16
//https://us16.api.mailchimp.com/3.0/lists/3f04544265/members

app.route('/')
  .get((req, res, next) => {
    res.render('main/home', { message: req.flash('success')});
  })
  .post((req, res, next) => {
    request({
      url: 'https://us16.api.mailchimp.com/3.0/lists/3f04544265/members',
      method: 'POST',
      headers: {
        'Authorization': 'randomUser 3b41263ec1bd0730ceb0c0b0101960bc-us16',
        'Content-Type': 'application/json'
      },
      json: {
        'email_address': req.body.email,
        'status': 'subscribed'
      }
    }, function(err, response, body) {
      if(err) {
        return console.log(err);
      }
      req.flash('success', 'You have submited your email');
      console.log('Successfully sent');
      res.redirect('/');
    });
  });

app.listen(3030, (err) => {
  if(err) {
    return console.log(err);
  }

  console.log('running on port 3030');
});
