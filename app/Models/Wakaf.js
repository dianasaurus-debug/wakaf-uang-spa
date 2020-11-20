var mongoose = require('mongoose');
var brcypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const TransaksiSchema = new Schema({
    nominal:  { type: Number, required: true },
    wakif_id: {	 type: Schema.Types.ObjectId, ref: 'User' },
    program_id: {	 type: Schema.Types.ObjectId, ref: 'Program' },
    status : { type : Boolean, required: true, default : false}
}, {
    timestamps : true
});
module.exports = mongoose.model('Transaksi', TransaksiSchema);