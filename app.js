
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
    ,mongoskin = require('mongoskin')
  ,Services = require('./routes/services')
    ,EJSpartials = require('express-partials')
  , path = require('path');

var app = express();
if (!process.env.MONGOLAB_URI) {
    //for those without foreman
    //DONT DO THIS AT HOME!!!!!!!!
    process.env.MONGOLAB_URI = 'mongodb://heroku_app15480966:fsg7rb9jvvj2m0b5q6ra3f5f5u@ds061757.mongolab.com:61757/heroku_app15480966';
}

var mongo = mongoskin.db(process.env.MONGOLAB_URI + "?auto_reconnect=true&poolSize=2", {w:1});
// all environments

app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'stdLayout'); // defaults to 'layout'
app.use(EJSpartials());

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/twitter-search', Services.twitterSearch);
app.get('/position', Services.position);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
