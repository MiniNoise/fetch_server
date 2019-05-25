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
const Minitel = require('./Config/model/Minitel.js');
const Flux = require('./Config/model/Flux.js');
processList = [];

mongoose.connect('mongodb://db/mininoise', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function CreateProcess(MinitelId, Type, params) {
		switch (Type) {
			case "Twitter":
				console.log(params);
				processList.push(new Twitter(MinitelId, params).run());
				break;
				
			default:
			console.log("Please follow the README.md for execute the script");
			break;
		}
}

app.get('/', (req, res) => {
    return res.send('Hello world');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.post("/api/minitel/new", async (req, res) => {
	var minitel = new Minitel({
		name: req.body.id
	});
	minitel.name = req.body.id;
	minitel.save(function(err) {
		if (err) {
			return res.json(err);
		} else {
			return res.json({ message: 'Minitel created!', minitel_id: minitel._id });
		}
	});
});

app.post("/api/minitel/:id/new/flux", async (req, res) => {	
	var newArr = req.body.params.trim().split(",");
	var flux = new Flux({
		type: req.body.type,
		params: newArr,
		minitel_id: req.params.id
	})
	flux.save(function(err) {
		if (err) {
			return res.json(err);
		} else {
			CreateProcess(req.body.id, req.body.type, newArr);
			return res.json({ message: 'Minitel created!' });
		}
	});
});

app.get("/api/minitel/info/:id", async (req, res) => {
	Minitel.findById(req.params.id, function(err, minitel) {
		if (err) {
			res.send(err);
			console.log("PAS GG");
		}
		res.send(minitel);
	});
});

app.get("/api/minitel/all_minitel", async (req, res) => {
	Minitel.find(function(err, minitel) {
		if (err)
			res.send(err);

		res.json(minitel);
	});
});

app.get("/api/minitel/all_flux", async (req, res) => {
	Flux.find(function(err, flux) {
		if (err)
			res.send(err);

		res.json(flux);
	});
});
//TODO: Feature database for minitell logged + auto reboot