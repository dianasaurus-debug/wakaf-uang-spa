angular.module('wakifCtrl', ['userServices', 'wakifServices', 'AuthServices'])
    .controller('wakifCtrl', function($window, $http, $scope, $location, $timeout, User, Auth, Transaksi){
        var app = this;
        app.tofield = false;

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
        Auth.getUser().then(function(data){
            app.pengirim = data.data._id;
        });
        Transaksi.getPenerima().then(function(data){
            if(data.data.success){
                app.daftar_penerima = data.data.transactions;
            }
            else {
                app.errorMsg = 'Tidak ada data penerima!';
            }
        })
        function tofield(){
            alert('bing!');
            app.tofield = true;
        }
        function getTransaksi() {
            Transaksi.getTransaksi().then(function(data){
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
                    app.lengths = tanggals.length;
                    app.tanggals = tanggals;
                    app.dapat_transaksi = data.data.transactions;
                    app.penerimaarray = data.data.penerima;
                    app.viewby = 10;
                    app.totalItems = app.penerimaarray.length;
                    app.currentPage = 1;
                    app.maxSize = 5; //Number of pager buttons to show
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
        Transaksi.getTransaksi().then(function(data){
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
                app.lengths = tanggals.length;
                app.tanggals = tanggals;
                app.dapat_transaksi = data.data.transactions;
                app.penerimaarray = data.data.penerima;
            }
            else {
                app.errorMsg = 'Tidak ada data penerima!';
            }
        });

        this.transData = function(tranData){
            Transaksi.create(app.tranData).then(function(data){
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
        app.editTransaksi = function(id_transaksi){
            Transaksi.getEdit(id_transaksi).then(function(data){
                if(data.data.success){
                    console.log("clicked!");
                    app.edit_transactions = data.data.transactions;
                    $scope.updateData = {
                        nominal : app.edit_transactions.nominal,
                        program_id : app.edit_transactions.program_id._id,
                        name : app.edit_transactions.program_id.name
                    }
                }
            })
        };
        app.viewData = function(id_transaksi){
            Transaksi.detailWakaf(id_transaksi).then(function(data){
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
                        app.view_transaksi = data.data.transactions;
                        app.view_penerima = data.data.transactions.program_id.name;
                    }
                }
            })
        };
        app.doDeletion = function(id_transaksi){
            app.loading = true;
            Transaksi.doDeleteData(id_transaksi).then(function(data){
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
        app.updateTransaksi = function(id_data){
            var app = this;
            app.successMsg = false;
            app.loading = true;
            console.log('hello from update!');
            Transaksi.doupdateData($scope.updateData, id_data).then(function(data){
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
    })