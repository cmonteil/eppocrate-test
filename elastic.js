// export SEARCHBOX_URL=http://paas:d7579a8b7c6c6bf7b3e92a3592ad90b8@dwalin-us-east-1.searchly.com
// https://site:01b5f7d2909c14248c6f81bf61625158@dwalin-us-east-1.searchly.com
// export FIREBASE_URL=http://eppocratetest.firebaseio.com

var Firebase = require('firebase');
var elasticsearch = require('elasticsearch');

var config = {
    firebaseUrl: process.env.FIREBASE_URL,
    elasticSearchUrl: process.env.SEARCHBOX_URL
}
var rootRef = new Firebase(config.firebaseUrl);

var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});

var usersRef = rootRef.child('articles');

usersRef.on('child_added', upsert);
usersRef.on('child_changed', upsert);
usersRef.on('child_removed', remove);

function upsert(snapshot){
    client.index({
        index: 'firebase',
        type: 'articles',
        id: snapshot.key(),
        body: snapshot.val()
    }, function(error, response){
        if(error){
            console.log("Error indexing articles : " + error);
        } else {
            console.log("Added new article " + snapshot.val().title);
        }
    })

}

function remove(snapshot){
    client.delete({
        index: 'firebase',
        type: 'articles',
        id: snapshot.key()
    }, function(error, response){
        if(error){
            console.log("Error deleting articles : " + error);
            console.log("Removed new article " + snapshot.val().title);
        }
    });
}
