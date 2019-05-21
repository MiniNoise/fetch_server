# ADD DATA INPUT

## How to add new data flux like twitter

* In first time you need to choose the flux

* Add file in './src/[FLUX_NAME].js

* Now let's implement your volunter

If you need a config element like token, follow the Config_file.md

After this you need to add your creation to createProcess in index.js

``` javascript
function CreateProcess(MinitelId, Type, params) {
    switch (type) {
        case "Twitter": <--Like that-->
            processList.push(new Twitter(MinitelId, params).run());
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
var TTwitter = new Twit(config);
const redisClient = require('./redis-client');

class Twitter{
    constructor(MinitelId, target) {
        var newArr = target.trim().split(",");
        this.stream_msg = TTwitter.stream('statuses/filter', {track: newArr});
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
```

``` javascript
switch (Type) {
    case "Twitter":
        processList.push(new Twitter(MinitelId, params).run());
        break;

    default:
    console.log("Please follow the README.md for execute the script");
    break;
}
```