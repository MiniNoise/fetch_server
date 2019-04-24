var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MinitelSchema = new Schema({
    "name": { type: String, required: true, unique: true },
    "flux": [
        {
            "type": String,
            "params": String
        }
    ]
});

module.exports = mongoose.model('Minitel', MinitelSchema);