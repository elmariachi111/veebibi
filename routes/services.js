/**
 * Created with JetBrains WebStorm.
 * User: stadolf
 * Date: 5/4/13
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */

var Twitter = require('twitter');

exports.twitterSearch = function(req, res) {
    var twit = new Twitter();
//54.036022,10.447311,25mi

    twit.search('pizza', {geocode: '54.036022,10.447311,25mi' },function(data) {
        res.json(data);
    });
}

exports.position = function(req, res) {
    res.render("gpspos",{title:'Oh hai'});
}

