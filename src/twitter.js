const {promisify} = require('util');
var Twit = require('twit');
var config = require('../Config/Twitter');
var TTwitter = new Twit(config);
var amqp = require('amqplib/callback_api');


class Twitter{
	constructor(MinitelId, target) {
		console.log("New twitter listener");
		console.log("START "+ MinitelId);
		this.MinitelId = MinitelId;
		console.log("AFTER " + this.MinitelId);
		this.stream_msg = TTwitter.stream('statuses/filter', {track: target});
	}

	run(MinitelId) {
		console.log("GO RUN");
		this.stream_msg.on('tweet', function(tweet) {
			var json = {};
			json['author'] = '@' + tweet.user.name;
			json['message'] = tweet.text;
			console.log("New event on Twitter API");

			amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
				if (error0) {
					throw(error0);
				}
				connection.createChannel((error1, channel) => {
					if (error1) {
						throw(error1);
					}
					channel.assertQueue(MinitelId, {
						durable: true
					});
					channel.sendToQueue(MinitelId, Buffer.from(JSON.stringify(json))); 
					console.log(" [x] Sent %s", JSON.stringify(json));
				});
			});
		});
	}

// 	amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
// 		if (error0) {
// 			throw(error0);
// 		}
// 		connection.createChannel((error1, channel) => {
// 			if (error1) {
// 				console.log("NTM")
// 				throw(error1);
// 			}
// 			channel.assertQueue(this.MinitelId, {
// 				durable: true
// 			});
// 			console.log("BEFORE");
// 			channel.sendToQueue(this.MinitelId, Buffer.from(JSON.stringify(json)));
// 			console.log(" [x] Sent %s", JSON.stringify(json));
// 			console.log("BAFTER");
// 		});
// 	});
// });
}

Twitter.MinitelId = "NULL";

module.exports = Twitter;