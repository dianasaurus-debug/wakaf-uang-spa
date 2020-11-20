angular.module('wakifServices', [])
    .factory('Transaksi', function($http){
        transaksiFactory = {};
        transaksiFactory.create = function(transData){
            return $http.post('/api/kirim-wakaf', transData);
        };
        transaksiFactory.getPenerima = function(){
            return $http.get('/api/all-program');
        }
        transaksiFactory.getTransaksi = function(){
            return $http.get('/api/daftar-wakaf');
        }
        transaksiFactory.getEdit = function(id_transaksi){
            return $http.get('/api/daftar-wakaf/edit/' + id_transaksi);
        }
        transaksiFactory.doupdateData = function(updateData, id_data){
            return $http.post('/api/daftar-wakaf/update/' + id_data , updateData);
        }
        transaksiFactory.doDeleteData = function(id_data){
            return $http.delete('/api/daftar-wakaf/delete/' + id_data);
        }
        transaksiFactory.detailWakaf = function(id_data){
            return $http.get('/api/wakaf/' + id_data);
        }
        return transaksiFactory;
    })
