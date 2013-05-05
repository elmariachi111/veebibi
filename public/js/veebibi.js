
var VB = {};

VB.BrowserLocation = function() {

}

VB.BrowserLocation.prototype = {

    getNavigatorLocation: function(callback) {
        navigator.geolocation.getCurrentPosition(
            callback,
            function() { console.log("error"); callback(null); },
            {'enableHighAccuracy':true,'timeout':10000,'maximumAge':0}
        );
        return true;
    }

};

VB.StationLocator = function() {


}

VB.StationLocator.prototype = {

    findLines: function(jsLatLng, callback) {
        $.get('/findlines', jsLatLng, function(resp) {
            callback(resp);
        });
    }
}