var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

var FluxSchema = new Schema({
    type: { type: String, required: true },
    params: [{ type: String }],
    minitel_id: ObjectId
})

module.exports = mongoose.model('Flux', FluxSchema);