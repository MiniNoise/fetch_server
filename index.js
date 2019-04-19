const process = require('process');
const express = require('express');
const app = express();
var params = [];

switch (process.argv[2]) {
	case "Twitter":
		process.argv.forEach((val, index) => {
			if (index > 2)
				params[params.length] = val;
		});
		console.log(params);
		break;

	default:
		console.log("Please follow the README.md for execute the script");
		break;
}

app.get('/', (req, res) => {
    return res.send('Hello world');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.get('/store/:key', async (req, res) => {
    const { key } = req.params;
    const value = req.query;
    await redisClient.setAsync(key, JSON.stringify(value));
    return res.send('Success');
});

app.get('/:key', async (req, res) => {
    const { key } = req.params;
    const rawData = await redisClient.getAsync(key);
    return res.json(JSON.parse(rawData));
});

//TODO ADD FORK