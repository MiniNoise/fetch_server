const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Twitter = require('./src/twitter');
const mongoose = require("mongoose");
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

//MODEL
const Minitel = require('./Config/model/Minitel.js')


mongoose.connect('mongodb://db/mininoise', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function CreateProcess(MinitelId, Type, params) {
	// if (cluster.isMaster) {
		// console.log(`Master ${process.pid} is running`);
	
		// // Fork workers.
		// for (let i = 0; i < numCPUs; i++) {
		// 	cluster.fork();
		// }
	
		// cluster.on('exit', (worker, code, signal) => {
		// 	console.log(`worker ${worker.process.pid} died`);
		// });
	// } else {
		switch (Type) {
			case "Twitter":
			console.log(params);
				Twitter.ListenTwitter(MinitelId, params);
				break;
				
			default:
			console.log("Please follow the README.md for execute the script");
			break;
		}
		// console.log(`Worker ${process.pid} started`);
	// }
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

app.post("/api/minitel/new", async (req, res) => {	
	var minitel = new Minitel();
	minitel.name = req.body.id;
	minitel.flux[0] = {"type": req.body.type, "params": req.body.params}

	minitel.save(function(err) {
		if (err)
			console.log(err);
		else
			console.log({ message: 'Minitel created!' });
	});
	CreateProcess(req.body.id, req.body.type, req.body.params);
	return res.json("create");
});

app.post("/api/minitel/:id/new/flux", async (req, res) => {	
	Minitel.update({ "_id": req.params.id },{ "$push": { "flux": {"type": req.body.type, "params": req.body.params } } }, function(err) {
		if (err)
			console.log(err);
		else
			console.log({ message: 'Add flux !' });
	});
	CreateProcess(req.params.id, req.body.type, req.body.params);
	return res.json("create");
});

app.get("/api/minitel/info/:id", async (req, res) => {
	Minitel.findById(req.params.id, function(err, minitel) {
		if (err) {
			res.send(err);
			console.log("PAS GG");
		}
		console.log(minitel);
	});
});

app.get("/api/minitel/all_minitel", async (req, res) => {
	Minitel.find(function(err, minitel) {
		if (err)
			res.send(err);

		res.json(minitel);
	});
});

//TODO ADD FORK
//TODO: Feature database for minitell logged + auto reboot