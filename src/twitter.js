var Twit = require('twit');
var config = require('../Config/Twitter');
var Twitter = new Twit(config);
var stream_msg = Twitter.stream('statuses/filter', {track: ['#orange']});

stream_msg.on('tweet', function(tweet) {
	var json = {};
	json['author'] = '@' + tweet.user.name;
	json['message'] = tweet.text;
	console.log(json);
});