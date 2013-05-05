
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

VB.Frontend = function (gmap) {
    this.gmap = gmap;
    this.polyLines = [];
    this.markers = [];
    this.$backdrop = $('#mega-backdrop');
    this.$indicator = $('#loading-indicator');
    this.$flag = $('#flag')

}

VB.Frontend.COLORS =  [
    '#0BCBD4',
    '#0057F6',
    '#00EB5E',
    '#48D40B',
    '#EDE600',
    '#D45B0B',
    '#FFB214',
    '#EB1300',
    '#D40BAC',
    '#7B00EC',
    '#190000'
];
VB.Frontend.prototype = {
    start: function(gmPos) {
        this.$backdrop.addClass("hide");
        this.gmap.setCenter(gmPos);
        this.gmap.setZoom(16);

        google.maps.event.addListener(this.gmap, 'click', this.onMapClicked.bind(this));
        this.locator = new VB.StationLocator();
    },
    showFlag: function(marker, content, event) {
        this.$flag.html(content);
        this.$flag.removeClass('hide');
  //      this.$flag.offset({top:event.pixel.y,left:event.pixel.x});

    },
    hideFlag: function() {
        this.$flag.addClass('hide');
    },
    createMarker: function(latLng, color,  line, station) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: this.gmap,
            flat:true,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3,
                strokeColor: color
            }
        });
        this.markers.push(marker);

        var content = "[" + line.line + "] " + station.name;
        google.maps.event.addListener(marker, 'mouseover', this.showFlag.bind(this,this.marker, content));
        google.maps.event.addListener(marker, 'mouseout', this.hideFlag.bind(this));

        return marker;
     },
     onMapClicked: function(e) {
         this.$backdrop.removeClass("hide");
         this.$indicator.removeClass("hide");
         _.each(this.polyLines, function(pl) {
            pl.setMap(null);
            pl = null;
        });
        _.each(this.markers, function(m) {
            m.setMap(null);
            m = null;
        });
         this.markers.length = [];

        var self = this;

        var latlng = { lat:e.latLng.lat(), lng: e.latLng.lng() };
        this.locator.findLines(latlng, function(lines) {
            self.$backdrop.addClass("hide");
            self.$indicator.addClass("hide");
            console.dir(lines);
            var polyOptions = {
                strokeOpacity: 1.0,
                strokeWeight: 3
            };
            _.each(lines, function(line) {
                polyOptions.strokeColor = VB.Frontend.COLORS[_.random(VB.Frontend.COLORS.length)];
                var poly = new google.maps.Polyline(polyOptions);
                poly.vbbLine = line;

                google.maps.event.addListener(poly,'click', function(e) {
                    alert(this.vbbLine.line);
                });
                self.polyLines.push(poly);
                poly.setMap(self.gmap);

                var path = poly.getPath();
                _.each(line.stations, function(station) {
                    var latLng = new google.maps.LatLng(station.loc.lat, station.loc.lng);
                    path.push(latLng);
                    self.createMarker(latLng, polyOptions.strokeColor,line, station);
                });
            });
        });
    }

}