const express = require('express')
const express-session = require('express-session')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const config = require('config.js')
const cors = require('cors')
const request = require('request')

const app = express()

app.use(session({
  resave:true,
  saveUnitialized:true,
  secret:'keyboardcat'
}))
app.use(passport.initialize() )
app.use(passport.session() )

app.use(express.static('./public'))

function requireAuth (req, res, next) {
  if(!req.isAuthenticated()) {
    return res.status(403).end();
  }
  return next();
}

passport.use(new Auth0Strategy({
  domain: config.auth0.domain,
  clientID: config.auth0.clientID,
  clientSecret: config.auth0.clientSecret,
  callbackURL: '/auth/github/callback'
},
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);

  }))

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user)


app.get('/auth/github', passport.authenticate('auth0', {
  connection: 'github'
}));

app.get('/auth/github/callback',
  passport.authenticate('auth0', {
    successRedirect: '/#/home'
  }),
  function(req, res) {
    if(!req.user) return res.sendStatus(404);
    res.status(200).send(re.user)
  });

  app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/')
  })

  app.get('/api/github/followers', requireAuth, function(req, res, next) {
    var options = {
      url: req.user._json.followers_url,
      headers: {
        'User_Agent': req.user._json.clientID
      }
    }
    request(options, function(err, response, body) {
      res.send(body);
    })
  })

  app.listen(3000, function() {
    console.log(`Dude, I'm listening on port ${port}`)
  })
