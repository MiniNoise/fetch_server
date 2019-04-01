var express = require('express');
var app = express();
var port = process.env.port || 8080;
var router = express.Router();

router.get('/', function(req, res) {
	res.json({message: 'Welcome to MiniFetch api '})
});

console.log('[Server minifetch]: Starting');
app.listen(port);
console.log('[Server minifetch]: Listen on port: ' + port + ' ✔️');