angular.module('mainController', ['AuthServices'])
    .controller('mainCtrl', function($location, $timeout, $scope, Auth, User, $rootScope){
        var app = this;
        $scope.getClass = function (path) {
            $scope.getClass = function (path) { if ($location.path().substr(0, path.length) == path) { if (path == "/" && $location.path() == "/") { return "active"; } else if (path == "/") { return ""; } return "active" } else { return "" } }
        }
        $rootScope.$on('$routeChangeStart', function(){
            if(Auth.isLoggedIn()){
                app.isLoggedIn = true;
                Auth.getUser().then(function(data){
                    app.username = data.data.username;
                    app.email = data.data.email;
                    $scope.username = data.data.username;
                    $scope.email = data.data.email;
                })
            }
            else {
                app.isLoggedIn = false;
                console.log('Something is wrong here!');
                app.username='';
                $scope.username = '';
                $scope.email = '';
            }
        })
        this.doLogin = function(loginData){
            app.errorMsg = false;
            app.loading = true;
            Auth.login(app.loginData).then(function(data){
                if(data.data.success){
                    app.successMsg = data.data.message + ' Redirecting ...';
                    app.loading=false;
                    $timeout(function(){
                        $location.path('/profile');
                        app.loginData = '';
                        app.successMsg=false;
                    }, 2000);
                }
                else {
                    app.errorMsg = data.data.message;
                    app.loading=false;
                }
            })
        };
        this.logout = function(){
            Auth.logout();
            app.isLoggedIn = false;
            $location.path('/logout');
            $timeout(function(){
                $location.path('/');
            }, 2000);
        }
    })