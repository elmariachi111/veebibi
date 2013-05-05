/**
 * Created with JetBrains WebStorm.
 * User: stadolf
 * Date: 5/4/13
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */

var Twitter = require('twitter');
var und = require('lodash');

var Services = module.exports = function(db) {
    if (!db)
        return;

    this.db = db;

    this.C = db.collection("veebibi");
}

Services.prototype = {
    twitterSearch: function(req, res) {
        var twit = new Twitter();
    //54.036022,10.447311,25mi

        twit.search('pizza', {geocode: '54.036022,10.447311,25mi' },function(data) {
            res.json(data);
        });
    },
    consolidateLines: function(lines) {
        var finalLines= [];
        und.each(lines, function(dbline) {
            dbline.stations = und.reject(dbline.stations, function(s) {
                return (s.id=="9096310"); //Märkische Zeile is some kind of bug in the import
            });
            var inList = und.find(finalLines, function(fl) {
                return fl.line == dbline.line;
            });
            if (inList) {
                if (dbline.stations.length > inList.stations.length)
                    inList.stations = dbline.stations;
            } else {
                finalLines.push(dbline);
            }
        });
        return finalLines;
    },
    findlines: function(req, res) {
        var self = this;
        var queryPos = [ Number(req.param('lng')), Number(req.param('lat')) ];

        this.db.collection("veebibi").find({
            "stations.loc": { "$near": queryPos}
        }).toArray(function(err, doc) {
            if (!err) {
                var cLines = self.consolidateLines(doc);
                res.json(cLines);
            } else {
                res.send(500,"no lines found");
            }
        });
    },

}

