var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MinitelSchema = new Schema({
    "name": { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Minitel', MinitelSchema);