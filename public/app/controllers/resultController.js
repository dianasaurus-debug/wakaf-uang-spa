angular.module('resultController', ['userServices', 'wakifServices', 'AuthServices', 'programServices'])
    .controller('resultController', function($routeParams,$window, $http, $scope, $location, $timeout, User, Auth, Transaksi, Program){
        var app = this;

            Program.detailProgram($routeParams.id).then(function(data){
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
            });
        function getDiterima(){
            Program.getDiterimaByProgram($routeParams.id).then(function(data){
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
        Program.getDiterimaByProgram($routeParams.id).then(function(data){
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
            Program.confirm(id_transaksi).then(function(data){
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