var express = require('express');
var morgan = require('morgan');
const multer = require('multer');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/Routes/api')(router);
const dbase_url = 'mongodb://127.0.0.1:27017/wakaf-project';
const port = process.env.PORT || 2000;
const path = require('path');

var app = express();
app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', appRoutes);
mongoose.connect(dbase_url, function(err){
    if(err){
        console.log('Belum bisa konek bos karena' + err);
    }
    else {
        console.log('Sip good job database sudah bisa dipake!');
    }
});
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
app.listen(port, function(){
    console.log('Berhasil konek ke ' + port);
});

