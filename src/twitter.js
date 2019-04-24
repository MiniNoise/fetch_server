const {promisify} = require('util');
var Twit = require('twit');
var config = require('../Config/Twitter');
var Twitter = new Twit(config);
const redisClient = require('./redis-client');

function TwitterListen(MinitelId, target) {
	var stream_msg = Twitter.stream('statuses/filter', {track: target});

	stream_msg.on('tweet', function(tweet) {
		var json = {};
		json['author'] = '@' + tweet.user.name;
		json['message'] = tweet.text;
		redisClient.setAsync("twitter", JSON.stringify(json));	
		console.log("PUSH BY:" + MinitelId);
	});
}

module.exports = {
	ListenTwitter: promisify(TwitterListen)
}