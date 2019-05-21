const {promisify} = require('util');
var Twit = require('twit');
var config = require('../Config/Twitter');
var TTwitter = new Twit(config);
const redisClient = require('./redis-client');


class Twitter{
	constructor(MinitelId, target) {
		this.stream_msg = TTwitter.stream('statuses/filter', {track: target});
	}
	run() {
		this.stream_msg.on('tweet', function(tweet) {
			var json = {};
			json['author'] = '@' + tweet.user.name;
			json['message'] = tweet.text;
			redisClient.setAsync("twitter", JSON.stringify(json));
			console.log("New event on Twitter API");
		});
	}
}

module.exports = Twitter;