var express = require('express');
var elasticsearch = require('elasticsearch');
var app = express();


var config = {
    firebaseUrl: process.env.FIREBASE_URL,
    elasticSearchUrl: process.env.SEARCHBOX_URL
}

var elastic = new elasticsearch.Client({
    host: config.elasticSearchUrl
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/content');
});

app.get('/search', function(request, response) {
	// https://www.elastic.co/guide/en/elasticsearch/guide/current/search-lite.html
	q = request.query.q;
	elastic.search({
	    index: 'firebase',
	    type: 'articles',
	    body: { query: { query_string: { query:q } } }
	}).then(function (resp) {
		response.render('pages/search', {
			results: resp.hits.hits, query_string: q
		});
	}, function (err) {
	    response.send(err.message);
	});	
});

app.get('/tutorial', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


