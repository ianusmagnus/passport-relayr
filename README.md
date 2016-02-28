# passport-relayr

[Passport](http://passportjs.org/) strategy for authenticating with
[Relayr](https://relayr.io/) using the OAuth 2.0 API.

This module lets you authenticate using Replayr in your Node.js applications.
By plugging into Passport, Replayr authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Current Status

_Beta_ - Needs some more tests.

## Install

    $ npm install passport-relayr

## Usage

### Create an Application

Before using `passport-relayr`, you must register an application with Relayr.
If you have not already done so, a new application can be created at [Relayr Dashboard](https://developer.relayr.io/).
Your application will be issued an OAuth Client ID and OAuth Client Secret, which need to be provided to the strategy.
You will also need to configure a Redirect URI which matches the route in your application.

### Configure Strategy

The Relayr authentication strategy authenticates users using a Relayr
account and OAuth 2.0 tokens.  The client ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives a access token.  The `verify` callback must call `done` providing a user to
complete authentication. A `refreshToken` won't be issued, since the `accessToken` doesn't expire.

```js

var RelayrStrategy = require('passport-relayr').Strategy;

passport.use(new RelayrStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/relayr/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ name: profile.name }, function (err, user) {
      return done(err, user);
    });
  }
));
```
The `profile` contains the user id, name and email.

```json
{
  "id": "...",
  "name": "...",
  "email": "..."
}
```

### Authenticate Requests

Use `passport.authenticate()`, specifying the `'relayr'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/login/relayr',
    passport.authenticate('relayr'));

app.get('/login/relayr/return',
    passport.authenticate('relayr', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    });
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/ianusmagnus/passport-relayr-example)
as a starting point for their own web applications.

## Tests

```
$ npm test
```

## Acknowledgment

All credits go to [@jaredhanson](https://github.com/jaredhanson) for  developing and maintaining the [Passport](https://github.com/jaredhanson/passport) project 

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Jan Kirchner

## See Also

- [PassportJS](http://passportjs.org/)
- [Express](http://expressjs.com/)
- [OAuth](http://oauth.net/)
- [RFC 6749: 'The OAuth 2.0 Authorization Framework'] (http://tools.ietf.org/html/rfc6749)
- [Relayr OAuth Reference](https://developer.relayr.io/documents/relayrAPI/OAuthReference) 

