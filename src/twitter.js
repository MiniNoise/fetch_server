const {promisify} = require('util');
var Twit = require('twit');
var config = require('../Config/Twitter');
var TTwitter = new Twit(config);
var amqp = require('amqplib/callback_api');


class Twitter{
	constructor(MinitelId, target) {
		console.log("New twitter listener");
		this.MinitelId = MinitelId;
		this.stream_msg = TTwitter.stream('statuses/filter', {track: "#acte28"});
	}
	run() {
		console.log("Run ? " + this.MinitelId)
		this.stream_msg.on('tweet', function(tweet) {
			var json = {};
			json['author'] = '@' + tweet.user.name;
			json['message'] = tweet.text;
			console.log("New event on Twitter API");
			amqp.connect('amqp://rabbit', function(error0, connection) {
				if (error0) {
					throw error0;
				  }
				  connection.createChannel(function(error1, channel) {
					if (error1) {
					  throw error1;
					}
					channel.assertQueue(this.MinitelId, {
					  durable: true
					});
					channel.sendToQueue(this.MinitelId, Buffer.from(JSON.stringify(json)));
					console.log(" [x] Sent %s", JSON.stringify(json));
				});
			});
		});
	}
}

module.exports = Twitter;