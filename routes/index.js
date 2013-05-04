
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express for Veebibi' });

};

exports.position = function(req, res) {

    var lat = req.param('lat');
    var lng = req.param('lng');

    res.send("nothing found" );

}

