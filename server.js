const express = require('express');
const session = require('express-session');
const {json} = require('body-parser')
const passport = require('passport');
const auth0strategy = require('passport-auth0');
const gitHubApi = require('github');
const Promise = require('bluebird');
const request = require('request');
const config = require('./config');
const port = 3000;
const app = express();

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret
}));

app.use(json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

passport.use(new auth0strategy({
  domain: config.domain,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackURL
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/github', passport.authenticate('auth0', {
  connection: 'github'
}));

const requireAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(403).end();
  }
  return next();
}

// const github = new gitHubApi({
//     // optional
//    debug: true,
//    protocol: "https",
//    host: "api.github.com", // should be api.github.com for GitHub
//    pathPrefix: "", // for some GHEs; none for GitHub
//    headers: {
//        "user-agent": "My-App" // GitHub is happy with a unique user agent
//    },
//    Promise: require('bluebird'),
//    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
//    timeout: 5000
//   });
//
//
//
// app.get('/auth', passport.authenticate('auth0', {connection: 'github'}));
// app.get('auth/github/callback',
//   passport.authenticate('auth0', {successRedirect: '/#/home'}), (req, res) => {
//     res.status(200).send(req.user);
// });
// app.get('/me', (req, res, next) => {
//   if (req.user) res.json(req.user);
//   else res.json({message: 'Failure'});
// })


app.get('/auth/github/callback',
  passport.authenticate('auth0', {
    successRedirect: '/#!/home'
  }),
  function(req, res) {
    res.status(200).send(req.user);
  })

app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  res.status(200).send(req.user);
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/api/github/followers', requireAuth, function(req, res, next) {
  let options = {
    url: req.user._json.followers_url,
    headers: {
      'User-Agent': req.user._json.clientID
    }
  }
  request(options, function(err, response, body) {
    res.send(body);
  })
})

app.get('/api/github/:username/activity', requireAuth, function(req, res, next) {

  let options = {
    url: 'https://api.github.com/users/' + req.params.username + '/events',
    headers: {
      'User-Agent': req.user._json.clientID
    }
  }
  request(options, function(err, response, body) {
    res.send(body);
  })
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
