angular.module('allprogramsController', ['userServices', 'wakifServices', 'AuthServices', 'programServices'])
    .controller('allprogramsController', function($routeParams,$window, $http, $scope, $location, $timeout, User, Auth, Transaksi, Program){
        var app = this;
        $scope.openModalCreate = function(){
            var modal_popup = angular.element('#createnewData');
            modal_popup.modal('show');
        };
        $scope.closeModalCreate = function() {
            var modal_popup = angular.element('#createnewData');
            modal_popup.modal('hide');
        };
        Program.getAllProgram().then(function(data){
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
                app.transaksi = data.data.transactions;
                app.pangan = [];
                app.bangunan = [];
                app.kesehatan = [];
                app.pendidikan = [];
                for(var i=0;i<app.transaksi.length;i++){
                    if(app.transaksi[i].kategori=='pangan'){
                        app.pangan.push(app.transaksi[i]);
                    }
                }
                for(var i=0;i<app.transaksi.length;i++){
                    if(app.transaksi[i].kategori=='bangunan'){
                        app.bangunan.push(app.transaksi[i]);
                    }
                }
                for(var i=0;i<app.transaksi.length;i++){
                    if(app.transaksi[i].kategori=='kesehatan'){
                        app.kesehatan.push(app.transaksi[i]);
                    }
                }
                for(var i=0;i<app.transaksi.length;i++){
                    if(app.transaksi[i].kategori=='pendidikan'){
                        app.pendidikan.push(app.transaksi[i]);
                    }
                }
                console.log(app.pangan);
                app.pengirim = data.data.penerima;
            }
            else {
                app.errorMsg = 'Tidak ada data penerima!';
            }
        });

        app.getIdofProgram = function(id_program){
            $scope.openModalCreate();
            app.id_program_khusus = id_program;
        }
        app.transData = function(tranData){
            Program.sendToSpesProgram(app.tranData, app.id_program_khusus).then(function(data){
                console.log(app.id_program_khusus);
                if(data.data.success){
                    app.successMsg = data.data.message;
                    app.loading=false;
                    $scope.closeModalCreate();
                    $window.location.href = '/halaman_wakif';
                }
                else {
                    app.errorMsg = data.data.message;
                    app.loading=false;
                }
            })
        };

    })