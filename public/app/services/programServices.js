angular.module('programServices', [])
    .factory('Program', function($http){
        programFactory = {};
        programFactory.create = function(transData){
            return $http.post('/api/buat-program', transData);
        };
        programFactory.getMyProgram = function(){
            return $http.get('/api/my-program');
        }
        programFactory.getAllProgram = function(){
            return $http.get('/api/all-program');
        }
        programFactory.editProgram = function(id_program){
            return $http.get('/api/program/edit/' + id_program);
        }
        programFactory.sendToSpesProgram = function(data, id_program){
            return $http.post('/api/kirim-wakaf/' + id_program, data);
        }
        programFactory.updateProgram = function(updateData, id_data){
            return $http.post('/api/program/update/' + id_data , updateData);
        }
        programFactory.deleteProgram = function(id_data){
            return $http.delete('/api/program/delete/' + id_data);
        }
        programFactory.detailProgram = function(id_data){
            return $http.get('/api/program/' + id_data);
        }
        programFactory.confirm = function(id_transaksi){
            return $http.get('/api/daftar-diterima/konfirmasi/' + id_transaksi);
        }
        programFactory.getDiterima = function(){
            return $http.get('/api/daftar-diterima');
        }
        programFactory.getDiterimaByProgram = function(id_program){
            return $http.get('/api/daftar-diterima/' + id_program);
        }
        programFactory.confirm = function(id_program){
            return $http.get('/api/daftar-diterima/konfirmasi/' + id_program);
        }
        return programFactory;
    })
