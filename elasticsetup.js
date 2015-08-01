var elasticsearch = require('elasticsearch');

var config = {
    elasticSearchUrl: process.env.SEARCHBOX_URL
}

var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});


client.indices.create({
    index: "firebase",
    "body" : {
        "mappings": {
            "articles": {
                "properties": {
                    "author": { "type": "string", "index": "not_analyzed" },
                    "body": { "type": "string", "index": "not_analyzed" },
                    "tags": { "type": "string", "index": "not_analyzed" },
                    "title": { "type": "string", "index": "not_analyzed" }
                }
            }
        }
    }
}, function(err,resp,respcode){
    console.log(err,resp,respcode);
});
