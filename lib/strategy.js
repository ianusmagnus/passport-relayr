var OAuth2Strategy = require('passport-oauth2');
var util = require('util');
var uri = require('url');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * `RelayrStrategy` constructor.
 */
function RelayrStrategy(options, verifyCallback) {

    if (!verifyCallback) { throw new TypeError('verify callback is required'); }

    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://api.relayr.io/oauth2/auth';
    options.responseType = options.responseType || 'token';
    options.tokenURL = 'https://api.relayr.io/oauth2/token';
    options.scope = 'access-own-user-info+configure-devices';
    options.scopeSeparator = options.scopeSeparator || ' ';

    OAuth2Strategy.call(this, options, verifyCallback);
    this.name = 'relayr';
    this._profileURL = options.profileURL || 'https://api.relayr.io/oauth2/user-info';
    this._oauth2.useAuthorizationHeaderforGET(true);
}

/** Inherit from `OAuth2Strategy`. */
util.inherits(RelayrStrategy, OAuth2Strategy);

/** Fetch Relayr user profile. */
RelayrStrategy.prototype.userProfile = function(accessToken, done) {
    var url = uri.parse(this._profileURL);

    url = uri.format(url);

    this._oauth2.get(url, accessToken, function (err, body, res) {
        var json;

        if (err) {
            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        done(null, json);
    });
};

// Expose constructor.
module.exports = RelayrStrategy;
