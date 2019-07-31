# passport-authsider

[![NPM version](https://badge.fury.io/js/passport-authsider.svg)](http://badge.fury.io/js/passport-authsider)
[![Dependency Status](https://david-dm.org/authsider/badges.svg)](https://david-dm.org/authsider/badges)
[![devDependency Status](https://david-dm.org/authsider/badges/dev-status.svg)](https://david-dm.org/authsider/badges#info=devDependencies)

The [Authsider](http://www.authsider.io) strategy for [Passport.js](http://www.passportjs.org/).

## Installation

```
npm install passport-authsider
```

## Configuration

```javascript
const AuthsiderStrategy = require('passport-authsider').Strategy;

const strategy = new AuthsiderStrategy({
    domain: 'your-tenant.authsider.io',
    clientID: 'your-client-id',
    clientSecret: 'your-client-secret',
    callbackURL: 'https://www.your-website.com/login/callback',
}, function(accessToken, refreshToken, params, profile, done) {
    // accessToken: JWT or opaque token to call either the Authsider Authentication API or
    //              your custom API if an `audience` is requested.
    // refreshToken: opaque token to allow you to refresh your accessToken. Only provided if
    //               the requested scope contains `offline_support` and your target audiance
    //               allows it.
    // params: extra parameters from the /token response.
    // profile: information about the user.
    done(null, profile); 
});

passport.use(strategy);
```

### User profile

By default, the Authsider strategy provides a [Passport-like profile](http://www.passportjs.org/docs/profile/).

Optionally, you can configure the strategy to provide an OIDC-compliant user profile when calling the strategy constructor:

```javascript
const AuthsiderStrategy = require('passport-authsider').Strategy;

const strategy = new AuthsiderStrategy({
    // ...
    oidcCompliantProfile: true,
}, function(accessToken, refreshToken, params, profile, done) {
    // ...
});
```

### State

The OAuth 2.0 specification recommends the usage of the `state` parameter in [authorization requests](https://tools.ietf.org/html/rfc6749#section-4.1.1). The Authsider strategy provides support for it by default and requires session support to be enabled in your Express app.

Even though not being recommended, if you need to disable support for it, you can do so in the strategy's constructor:

```javascript
const AuthsiderStrategy = require('passport-authsider').Strategy;

const strategy = new AuthsiderStrategy({
    // ...
    state: false,
}, function(accessToken, refreshToken, params, profile, done) {
    // ...
});
```

## Usage

```javascript
app.get('/login', 
    passport.authenticate('authsider', {}), 
    function (req, res) {
        res.redirect('/');
    }
);

app.get('/login/callback',
    passport.authenticate('authsider', { failureRedirect: '/login' }),
    function(req, res) {
        if (!req.user) {
            throw new Error('Undefined user. Cannot proceed...');
        }
    
        res.redirect('/');
    }
);
```

### Additional login options

```javascript
// Specify the authorization request scope
app.get('/login', 
    passport.authenticate('authsider', { scope: 'openid email profile' }), 
    function (req, res) {
        res.redirect('/');
    }
);
```

```javascript
// Specify a target audience
app.get('/login', 
    passport.authenticate('authsider', { audience: 'https://api.example.com/' }), 
    function (req, res) {
        res.redirect('/');
    }
);
```

## Examples

Check out our sample web app to get you started.

- [Node web application](https://github.com/authsider/sample-web-nodejs)
