var chai = require('chai');
var RelayrStrategy = require('../lib/strategy');

describe('Strategy', function () {

    describe('constructed', function () {
        var strategy = new RelayrStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret'
            },
            function () {
            });

        it('should be named relayr', function () {
            expect(strategy.name).to.equal('relayr');
        });
    });

    describe('constructed with undefined options', function () {
        it('should throw', function () {
            expect(function () {
                var strategy = new RelayrStrategy(undefined, function () {
                });
            }).to.throw(Error);
        });
    });


    describe('authorization request with callback', function () {
        var strategy = new RelayrStrategy({
            clientID: 'ABC123',
            clientSecret: 'secret',
            callbackURL: 'http://localhost:3000/auth/callback'
        }, function () {
        });


        var url;

        before(function (done) {
            chai.passport.use(strategy)
                .redirect(function (u) {
                    url = u;
                    done();
                })
                .req(function (req) {
                })
                .authenticate({});
        });

        it('should be redirected', function () {
            expect(url).to.equal('https://api.relayr.io/oauth2/auth?' +
                'response_type=code' +
                '&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback' +
                '&scope=access-own-user-info%2Bconfigure-devices' +
                '&client_id=ABC123');
        });
    });


    describe('failure caused by user denying request', function () {
        var strategy = new RelayrStrategy({
            clientID: 'ABC123',
            clientSecret: 'secret'
        }, function () {
        });


        var info;

        before(function (done) {
            chai.passport.use(strategy)
                .fail(function (i) {
                    info = i;
                    done();
                })
                .req(function (req) {
                    req.query = {};
                    req.query.error = 'access_denied';
                    req.query.error_code = '200';
                    req.query.error_description = 'Permissions error';
                    req.query.error_reason = 'user_denied';
                })
                .authenticate();
        });

        it('should fail with info', function () {
            expect(info).to.not.be.undefined;
            expect(info.message).to.equal('Permissions error');
        });
    });

});