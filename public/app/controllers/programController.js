angular.module('programController', ['userServices', 'wakifServices', 'AuthServices', 'programServices'])
    .controller('programController', function($window, $http, $scope, $location, $timeout, User, Auth, Transaksi, Program){
        var app = this;

        $scope.openModalEdit = function(){
            var modal_popup = angular.element('#exampleModal');
            modal_popup.modal('show');
        };

        $scope.closeModalEdit = function() {
            var modal_popup = angular.element('#exampleModal');
            modal_popup.modal('hide');
        };
        $scope.openModalCreate = function(){
            var modal_popup = angular.element('#createnewData');
            modal_popup.modal('show');
        };
        $scope.closeModalCreate = function() {
            var modal_popup = angular.element('#createnewData');
            modal_popup.modal('hide');
        };
        function getTransaksi() {
            Program.getMyProgram().then(function(data){
                if(data.data.success){
                    var daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                    var monthNames = [
                        "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "December"
                    ];
                    var tanggals = [];
                    for(var i=0; i<data.data.dates.length;i++){
                        var hari = new Date(data.data.dates[i]);
                        tanggals.push(`${daysOfWeek[hari.getDay()]}, ${hari.getDate()} ${monthNames[hari.getMonth()]} ${hari.getFullYear()}`);
                    }
                    app.tanggals = tanggals;
                    app.dapat_transaksi = data.data.transactions;
                    app.penerimaarray = data.data.penerima;
                }
                else {
                    app.errorMsg = 'Tidak ada data penerima!';
                }
            });
        }

        $scope.editItem = function (item, id_transaksi) {
            app.editTransaksi(id_transaksi);
            item.editing = true;
        }
        Program.getMyProgram().then(function(data){
            if(data.data.success){
                var daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                var monthNames = [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "December"
                ];
                var tanggals = [];
                for(var i=0; i<data.data.dates.length;i++){
                    var hari = new Date(data.data.dates[i]);
                    tanggals.push(`${daysOfWeek[hari.getDay()]}, ${hari.getDate()} ${monthNames[hari.getMonth()]} ${hari.getFullYear()}`);
                }
                app.tanggals = tanggals;
                app.dapat_transaksi = data.data.transactions;
                console.log(app.dapat_transaksi);
                app.penerimaarray = data.data.penerima;
            }
            else {
                app.errorMsg = 'Tidak ada data penerima!';
            }
        });

        app.transData = function(tranData){
            Program.create(app.tranData).then(function(data){
                if(data.data.success){
                    app.successMsg = data.data.message;
                    app.loading=false;
                    getTransaksi();
                    $scope.closeModalCreate();
                }
                else {
                    app.errorMsg = data.data.message;
                    app.loading=false;
                }
            })
        };
        app.editProgram = function(id_transaksi){
            Program.editProgram(id_transaksi).then(function(data){
                if(data.data.success){
                    console.log("clicked!");
                    app.categories = ["pendidikan", "pangan", "bangunan", "kesehatan"];
                    app.edit_transactions = data.data.transactions;

                    $scope.updateData = {
                        name : app.edit_transactions.name,
                        desc : app.edit_transactions.desc,
                        kategori : app.edit_transactions.kategori,
                        target : app.edit_transactions.target,
                    }
                }
            })
        };
        app.viewData = function(id_transaksi){
            Program.detailProgram(id_transaksi).then(function(data){
                if(data.data.success){
                    console.log("clicked!");
                    if(data.data.success){
                        var daysOfWeek2 = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                        var monthNames2 = [
                            "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "December"
                        ];
                        var tanggal = new Date(data.data.transactions.createdAt);
                        var new_tanggal = `${daysOfWeek2[tanggal.getDay()]}, ${tanggal.getDate()} ${monthNames2[tanggal.getMonth()]} ${tanggal.getFullYear()}`;
                        app.view_tanggal = new_tanggal;
                        app.view_program = data.data.transactions;
                    }
                }
            })
        };
        app.doDeletion = function(id_transaksi){
            app.loading = true;
            Program.deleteProgram(id_transaksi).then(function(data){
                if(data.data.success){
                    app.successMsg = data.data.message;
                    app.loading=false;
                    getTransaksi();
                }
                else {
                    app.errorMsg = data.data.message;
                    app.loading=false;
                }
            })
        };
        app.updateProgram = function(id_data){
            var app = this;
            app.successMsg = false;
            app.loading = true;
            console.log('hello from update!');
            Program.updateProgram($scope.updateData, id_data).then(function(data){
                if(data.data.success){
                    app.successMsg = data.data.message;
                    app.loading=false;
                    getTransaksi();
                    $scope.closeModalEdit();
                }
                else {
                    app.errorMsg = data.data.message;
                    app.loading=false;
                }
            })
        }
        function getDiterima(){
            Program.getDiterima().then(function(data){
                if(data.data.success){
                    console.log(data);
                    var daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                    var monthNames = [
                        "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "December"
                    ];
                    var tanggals = [];
                    for(var i=0; i<data.data.dates.length;i++){
                        var hari = new Date(data.data.dates[i]);
                        tanggals.push(`${daysOfWeek[hari.getDay()]}, ${hari.getDate()} ${monthNames[hari.getMonth()]} ${hari.getFullYear()}`);
                    }
                    app.tanggals = tanggals;
                    app.nominal = data.data.transactions;
                    app.pengirim = data.data.pengirim;
                }
                else {
                    app.errorMsg = 'Tidak ada data penerima!';
                }
            });
        }
        Program.getDiterima().then(function(data){
            if(data.data.success){
                console.log(data);
                var daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                var monthNames = [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "December"
                ];
                var tanggals = [];
                for(var i=0; i<data.data.dates.length;i++){
                    var hari = new Date(data.data.dates[i]);
                    tanggals.push(`${daysOfWeek[hari.getDay()]}, ${hari.getDate()} ${monthNames[hari.getMonth()]} ${hari.getFullYear()}`);
                }
                app.tanggals = tanggals;
                app.nominal = data.data.transactions;
                app.pengirim = data.data.pengirim;
            }
            else {
                app.errorMsg = 'Tidak ada data penerima!';
            }
        });
        app.upConfirm = function(id_transaksi){
            app.loading = true;
            Diterima.confirm(id_transaksi).then(function(data){
                if(data.data.success){
                    console.log("clicked!");
                    app.successMsg = data.data.message;
                    app.loading=false;
                    getDiterima();
                }
                else {
                    app.errorMsg = data.data.message;
                    app.loading=false;
                }
            })
        };
    })