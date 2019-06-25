const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Twitter = require('./src/twitter');
const mongoose = require("mongoose");
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const PORT = process.env.PORT || 3000;

//MODEL
const Minitel = require('./Config/model/Minitel.js');
const Flux = require('./Config/model/Flux.js');
processList = [];

mongoose.connect('mongodb://db/mininoise', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


async function initService() {
	var All_minitel;
	
	await Minitel.find(function(err, minitel) {
		if (err)
			return (84);
		else
			All_minitel = minitel;
	});
	for (var minitel_iterator in All_minitel) {
		var fluxList;
		await Flux.find({minitel_id:All_minitel[minitel_iterator]._id}, function(err, flux) {
			if (err)
				res.send(err);
			else
				fluxList = flux;
		});
		for (var flux_iterator in fluxList) {
			CreateProcess(All_minitel[minitel_iterator].name, fluxList[flux_iterator].type, fluxList[flux_iterator].params);
		}
	}
}

function CreateProcess(MinitelId, Type, params) {
		switch (Type) {
			case "Twitter":
				processList.push(new Twitter(MinitelId, params).run(MinitelId));
				break;
			default:
			console.log("Please follow the README.md for execute the script");
			break;
		}
}


app.listen(PORT, () => {
	initService();
    console.log(`Server listening on port ${PORT}`);
});

app.get('/', (req, res) => {
	return res.send('Hello world');
});

app.post("/api/v1/minitel", async (req, res) => {
	var minitel = new Minitel({
		name: req.body.id
	});
	minitel.save(function(err) {
		if (err) {
			return res.json(500, err);
		} else {
			return res.json({ message: 'Minitel created!', minitel_id: minitel._id });
		}
	});
});

app.get("/api/v1/:id", async (req, res) => {
	Minitel.findById(req.params.id, function(err, minitel) {
		if (err) {
			res.send(500, err);
		} else {
			res.send(minitel);
		}
	});
});

app.post("/api/v1/:id/flux", async (req, res) => {	
	var newArr = req.body.params.trim().split(",");
	for (let index = 0; index < newArr.length; index++) {
		newArr[index] = newArr[index].trim();
	}
	var flux = new Flux({
		type: req.body.type,
		params: newArr,
		minitel_id: req.params.id
	})
	flux.save(function(err) {
		if (err) {
			return res.json(500, err);
		} else {
			Minitel.findById(req.params.id, (err, minitel) => {
				if (err) {
					res.send(500, err);
				} else {
					CreateProcess(minitel.name, req.body.type, newArr);
					return res.json({ message: 'Flux created!' });
				}
			});
		}
	});
});


app.get("/api/v1/minitel", async (req, res) => {
	Minitel.find(function(err, minitel) {
		if (err)
			res.send(500, err);
		else
			res.json(minitel);
	});
});

app.get("/api/v1/minitel/flux", async (req, res) => {
	Flux.find(function(err, flux) {
		if (err)
			res.send(500, err);
		else
			res.json(flux);
	});
});