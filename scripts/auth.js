var express = require('express'),
    authentication = require('express-authentication'),
    app = express();

module.exports = 
    
app.use(function myauth(req, res, next) {
    // provide the data that was used to authenticate the request; if this is 
    // not set then no attempt to authenticate is registered. 
    req.challenge = req.get('Authorization');
 
    req.authenticated = req.authentication === 'secret';
 
    // provide the result of the authentication; generally some kind of user 
    // object on success and some kind of error as to why authentication failed 
    // otherwise. 
    if (req.authenticated) {
        req.authentication = { user: 'bob' };
    } else {
        req.authentication = { error: 'INVALID_API_KEY' };
    }
 
    // That's it! You're done! 
    next();
});

