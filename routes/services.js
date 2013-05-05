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

/**
 * @return a bus line entity that comes with
 * GPS positions for all stops
 * @param req
 * @param res
 */
    postPosition: function(req, res) {
        var dummy = [
            {lat:52.516012,lng:13.418126},
            {lat:52.525204,lng:13.420186},
            {lat:52.526979,lng:13.41568},
            {lat:52.529799,lng:13.403749},
            {lat:52.529668,lng:13.401217},
            {lat:52.532462,lng:13.399029},
            {lat:52.531705,lng:13.389888},
            {lat:52.531705,lng:13.389888},
            {lat:52.527345,lng:13.387184},
            {lat:52.519668,lng:13.388214},
            {lat:52.520203,lng:13.393385},
            {lat:52.517592,lng:13.398149},
            {lat:52.520034,lng:13.404908},
            {lat:52.516143,lng:13.410539},
            {lat:52.515672,lng:13.414907},
            {lat:52.515633,lng:13.418083}
        ];
        res.send(dummy);
        //res.render("gpspos",{title:'Oh hai'});
    }
}

