# ADD DATA INPUT

## How to add new data flux like twitter

* In first time you need to choose the flux

* Add file in './src/[FLUX_NAME].js

* Now let's implement your volunter

If you need a config element like token, follow the Config_file.md

After this you need to add your creation to createProcess in index.js

``` javacript
    function CreateProcess(MinitelId, Type, params) {
        switch (type) {
            case "Twitter": <--Like that-->
                console.log(params);
                Twitter.ListenTwitter("Twitter", params);
                break;

            default:
                console.log("Please follow the README.md for execute the script");
                break;
        }
    }
```

Make unit tests and you can create a new pull request for share your creation !

## Exemple

File: ./src/twitter.js

``` javascript
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
```

``` javacript
    function CreateProcess(MinitelId, Type, params) {
        switch (type) {
            case "Twitter":
                console.log(params);
                Twitter.ListenTwitter("Twitter", params);
                break;

            default:
                console.log("Please follow the README.md for execute the script");
                break;
        }
}
```