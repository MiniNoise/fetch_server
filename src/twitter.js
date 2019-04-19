// DEFINE ELEMENT IN EACH FLUX
var MinitelId = null;
// EXECUTION
var Twit = require('twit');
var config = require('./Config/Twitter');
var Twitter = new Twit(config);
var stream_msg = Twitter.stream('statuses/filter', {track: ['#orange', "#fire"]});
const redisClient = require('./redis-client');

stream_msg.on('tweet', function(tweet) {
	var json = {};
	json['author'] = '@' + tweet.user.name;
	json['message'] = tweet.text;
    redisClient.setAsync("twitter", JSON.stringify(json));	
	console.log("push");
});