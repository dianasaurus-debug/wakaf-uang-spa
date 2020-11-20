var mongoose = require('mongoose');
var brcypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const ProgramSchema = new Schema({
    name:  { type: String, required: true },
    desc: {	 type: String, required: true },
    kategori : { type : String, required : true},
    imageUrl: String,
    target : { type: Number, required: true },
    progress : { type: Number, default : 0 },
    isFinished : { type: Boolean, default : false },
    maker_id: {	 type: Schema.Types.ObjectId, ref: 'User' },
    wakaf_ids :[ { type: Schema.Types.ObjectId, ref: 'Transaksi' }]
    }, {
    timestamps : true
});
module.exports = mongoose.model('Program', ProgramSchema);