// Put in your express server here. Use index.html for your
// view so have the server direct you to that.

var portnumber = 8080;
var express = require('express');
var request = require('superagent');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

app.use(express.static(__dirname));//tells express where to find 'static' files, like css.

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

//nodemailer section

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'tysonlafollette@gmail.com',
        pass: 'zfldbzdsnqvmveqf'
    }
});





///end nodemailer section





app.get('/', function(req, res){
    res.render('index');
});


//code to run when user posts to the index page.
app.post('/', function(req, res){
    
    // setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Shaedycult contact form.', // sender address
    to: 'tysonlafollette@gmail.com', // list of receivers
    subject: req.body.firstname + ' ' + req.body.lastname + ' wants Kool-Aid!', // Subject line
    text: 'This was sent by your contact page. ' + req.body.firstname + ' ' + req.body.lastname + ', ' + req.body.email, // plaintext body
    //html: '<b>Hello world ✔</b>' // html body
};

  // send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
});
    res.render('success');
});

app.get('/:username', function(req, res){
  var username = req.params.username;
  var myurl = 'http://api.github.com/users/' + username;
        // Configure the request
                var options = {
                url: myurl,
                method: 'GET',
                headers: {"User-Agent": "Request"}//headers,
        }
  if(username === undefined){
    res.status(404);
    res.send("This page doesn't exist");
  } else {
    request(options, function (error, response, body) {
      //Check for error
      if(error){
          return console.log('Error:', error);
      }
      var user = JSON.parse(body);
      var login = user.login;
      console.log(login);
      var followers = user.followers;
      var publicrepos = user.public_repos;
      var avatarurl = user.avatar_url;
      //All is good. Print the body
      res.render('result', {user: user, login: login, followers: followers, publicrepos: publicrepos, avatarurl: avatarurl});
  });
  }
});
app.listen(8080, function(){
  console.log("The server is running on localhost:" + portnumber);
})