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

    twit.search('nodejs OR #node', function(data) {
        res.json(data);
    });
}

