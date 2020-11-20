const mongoose = require("mongoose")
const User = require('../Models/User');
const Transaksi = require('../Models/Wakaf');
const Program = require('../Models/Program');



var jwt = require('jsonwebtoken');

var secret = 'akucintakamu';
module.exports = function(router) {
    router.post('/users', function(req, res){
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if(req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" || req.body.email == null || req.body.email == "" || req.body.name == null || req.body.name == ""){
            res.json({success : false, message : "Pastikan sudah mengisi semua field!"});
        }
        else{
            user.save(function(err){
                if(err){
                    res.json({success : false, message : "Email atau Username sudah ada!"});
                }
                else {
                    res.json({success : true, message : "User created!"});
                }
            })
        }
    });
    router.post('/authenticate', function(req, res){
        User.findOne({username : req.body.username}).select('email username password').exec(function(err, user){
            if(err) throw err;
            if(!user){
                res.json({success: false, message:"I don't know who I am. I think I have lost me :( !"});
            } else if(user){
                if(req.body.password){
                    var validPassword = user.comparePassword(req.body.password);
                    if(!validPassword){
                        res.json({success: false, message:"Can't authenticate password!"});
                    } else {
                        var token = jwt.sign({ _id : user._id, username : user.username, email : user.email }, secret, { expiresIn: '8h' });
                        res.json({success: true, message:"Login Success!", token : token});
                    }
                } else {
                    res.json({success: false, message:"Please fill out password field!"});
                }

            }
        });
    });
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(token) {
            jwt.verify(token, secret, function(err, decoded){
                if(err){
                    res.json({ success : false, message : 'Token Invalid!'});
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success : false, message : 'No token provided'});
        }
    });
    router.post('/profile', function(req, res){
        console.log(req.decoded);
        res.send(req.decoded);
    });
    router.post('/kirim-wakaf', function(req, res){
        var transaksi = new Transaksi();
        transaksi.wakif_id = req.decoded._id;
        transaksi.nominal = req.body.nominal;
        transaksi.program_id = req.body.program_id;
        if(req.body.nominal == null || req.body.nominal == "" || req.body.program_id == null || req.body.program_id == ""){
            res.json({success : false, message : 'Beberapa field dibutuhkan!'});
        }
        else{
            transaksi.save().then((result) => {
                Program.findOne({ _id: transaksi.program_id }, (err, program) => {
                    if (program) {
                        // The below two lines will add the newly saved review's
                        // ObjectID to the the User's reviews array field
                        program.wakaf_ids.push(transaksi);
                        program.save();
                        res.json({ success : true, message: 'Transaksi Berhasil dilakukan!' });
                    }
                });
            })
                .catch((error) => {
                    res.json({ success : false, message: 'Transaksi Belum Berhasil dilakukan!' });
                });
        }
    });

    router.post('/kirim-wakaf/:id', function(req, res){
        var transaksi = new Transaksi();
        transaksi.wakif_id = req.decoded._id;
        transaksi.nominal = req.body.nominal;
        transaksi.program_id = req.params.id;
        if(req.body.nominal == null || req.body.nominal == ""){
            res.json({success : false, message : 'Beberapa field dibutuhkan!'});
        }
        else{
            transaksi.save().then((result) => {
                Program.findOne({ _id: transaksi.program_id }, (err, program) => {
                    if (program) {
                        // The below two lines will add the newly saved review's
                        // ObjectID to the the User's reviews array field
                        program.wakaf_ids.push(transaksi);
                        program.save();
                        res.json({ success : true, message: 'Transaksi Berhasil dilakukan!' });
                    }
                });
            })
                .catch((error) => {
                    res.json({ success : false, message: 'Transaksi Belum Berhasil dilakukan!' });
                });
        }
    });

    router.get('/daftar-wakaf', function(req, res){
        Transaksi.find({ wakif_id : req.decoded._id }).populate('program_id').exec(function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    let penerimas = [];
                    let tanggals = [];
                    if(transactions.length<=0){
                        res.json({ success : true, message : "saat ini belum ada transaksi"});
                    }
                    else {
                        for (var i = 0; i < transactions.length; i++) {
                            penerimas.push(transactions[i].program_id.name);
                            tanggals.push(transactions[i].createdAt);
                        }
                        console.log(tanggals);
                        res.json({success: true, transactions: transactions, penerima: penerimas, dates: tanggals});
                    }
                }
            }
        });
    });

    router.get('/daftar-wakaf/edit/:id', function(req, res){
        Transaksi.findOne({ _id : req.params.id }).populate('program_id').exec(function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    res.json({ success : true, transactions : transactions});
                }
            }
        });
    });

    router.post('/daftar-wakaf/update/:id', function(req, res){
        Transaksi.findOne({ _id : req.params.id }).populate('program_id').exec(function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    var id_lama = transactions.program_id;
                    transactions.nominal = req.body.nominal;
                    transactions.program_id = req.body.program_id;
                    transactions.save().then((result) => {
                        Program.findOne({ _id: transactions.program_id }, (err, program) => {
                            if (program) {
                                // The below two lines will add the newly saved review's
                                // ObjectID to the the User's reviews array field
                                program.wakaf_ids.pull(id_lama);
                                program.wakaf_ids.push(transactions);
                                program.save();
                                res.json({ success : true, message: 'Transaksi Berhasil dilakukan!' });
                            }
                        });
                    })
                        .catch((error) => {
                            res.json({ success : false, message: 'Transaksi Belum Berhasil dilakukan!' });
                        });
                    transactions.save().then(product => {
                        res.json({ success : true, message : "Transaksi sudah berhasil diupdate!"});
                    })
                }
            }
        });
    });

    router.delete('/daftar-wakaf/delete/:id', function(req, res){
        Transaksi.findOneAndRemove({ _id : req.params.id }, function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    Program.findOne({ _id: transactions.program_id }, (err, program) => {
                        if (program) {
                            // The below two lines will add the newly saved review's
                            // ObjectID to the the User's reviews array field
                            program.wakaf_ids.pull(transactions);
                            program.save();
                            res.json({ success : true, message: 'Transaksi Berhasil dibatalkan!' });
                        }
                    })
                    .catch((error) => {
                        res.json({ success : false, message: 'Transaksi Belum Berhasil dibatalkan!' });
                    });
                }
            }
        });
    });

    router.get('/wakaf/:id', function(req, res){
        Transaksi.findOne({ _id : req.params.id }).populate('program_id').exec(function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    res.json({ success : true, transactions : transactions});
                }
            }
        });
    });

    router.get('/daftar-diterima/:id', function(req, res){
        Transaksi.find({ program_id : req.params.id }).populate('wakif_id').exec(function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    let pengirims = [];
                    let tanggals = [];
                    for(var i=0;i<transactions.length;i++){
                        pengirims.push(transactions[i].wakif_id.name);
                        tanggals.push(transactions[i].createdAt);
                    }
                    res.json({ success : true, transactions : transactions, pengirim : pengirims, dates : tanggals});
                }
            }
        });
    });
    router.get('/daftar-diterima/konfirmasi/:id', function(req, res){
        Transaksi.findOne({ _id : req.params.id}).populate('program_id').exec(function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    transactions.status = true;
                    transactions.save().then(product => {
                        res.json({ success : true, message : "Transaksi sudah dikonfirmasi!"});
                    })
                }
            }
        });
    });

    router.post('/buat-program', function(req, res){
        var program = new Program();
        program.maker_id = req.decoded._id;
        program.name = req.body.name;
        program.kategori = req.body.kategori;
        program.desc = req.body.desc;
        program.target = req.body.target;
        if(req.body.name == null || req.body.name == "" || req.body.desc == null || req.body.desc == "" || req.body.target == null || req.body.target == ""){
            res.json({success : false, message : 'Beberapa field dibutuhkan!'});
        }
        else{
            program.save(function(err){
                if(err){
                    res.json({success : false, message : err});
                }
                else {
                    res.json({success : true, message : "Program Berhasil ditambahkan!"});
                }
            })
        }
    });
    router.get('/all-program', function(req, res){
        Program.find({ }).populate('maker_id').exec(function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    let tanggals = [];
                    for(var i=0;i<transactions.length;i++){
                        tanggals.push(transactions[i].createdAt);
                    }
                    console.log(transactions);
                    res.json({ success : true, transactions : transactions, dates : tanggals});
                }
            }
        });
    });
    router.get('/my-program', function(req, res){
        Program.find({ maker_id : req.decoded._id }, function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    let tanggals = [];
                    for(var i=0;i<transactions.length;i++){
                        tanggals.push(transactions[i].createdAt);
                    }
                    res.json({ success : true, transactions : transactions, dates : tanggals});
                }
            }
        });
    });
    router.delete('/program/delete/:id', function(req, res){
        Program.findOneAndRemove({ _id : req.params.id }, function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No programs was found!"});
                else{
                    res.json({ success : true, message : "Program sudah berhasil dihapus!"});
                }
            }
        });
    });
    router.get('/program/edit/:id', function(req, res){
        Program.findOne({ _id : req.params.id }, function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No programs was found!"});
                else{
                    res.json({ success : true, transactions : transactions});
                }
            }
        });
    });
    router.get('/program/:id', function(req, res){
        Program.findOne({ _id : req.params.id }, function(err, transactions){
            if(err) throw err;
            else {
                if(!transactions)
                    res.json({ success : false, message : "No programs was found!"});
                else{
                    res.json({ success : true, transactions : transactions});
                }
            }
        });
    });
    router.post('/program/update/:id', function(req, res){
        Program.findOne({ _id : req.params.id }, function(err, program){
            if(err) throw err;
            else {
                if(!program)
                    res.json({ success : false, message : "No transactions was found!"});
                else{
                    program.name = req.body.name;
                    program.kategori = req.body.kategori;
                    program.desc = req.body.desc;
                    program.target = req.body.target;
                    program.save().then(product => {
                        res.json({ success : true, message : "Transaksi sudah berhasil diupdate!"});
                    })
                }
            }
        });
    });

    return router;
}