var app = angular.module('appRoutes', ['ngRoute', 'ui.bootstrap'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl : 'app/views/pages/home.html'
        })
        .when('/about', {
            templateUrl : 'app/views/pages/about.html'
        })
        .when('/register', {
            templateUrl : 'app/views/pages/user/register.html',
            controller : 'regCtrl',
            controllerAs : 'register',
            authenticated : false,
        })
        .when('/login', {
            templateUrl : 'app/views/pages/user/login.html',
            authenticated : false,
        })
        .when('/logout', {
            templateUrl : 'app/views/pages/user/logout.html',
            authenticated : true,
        })
        .when('/profile', {
            templateUrl : 'app/views/pages/user/profile.html',
            authenticated : true,
        })
        .when('/halaman_wakif', {
            templateUrl : 'app/views/pages/user/wakif/index.html',
            controller : 'wakifCtrl',
            controllerAs : 'wakif',
            authenticated : true,
        })
        .when('/my_program', {
            templateUrl : 'app/views/pages/user/penerima/my_program.html',
            controller : 'programController',
            controllerAs : 'program',
            authenticated : true,
        })
        .when('/program/detail/:id', {
            templateUrl : 'app/views/pages/user/penerima/index.html',
            controller : 'resultController',
            controllerAs : 'program',
            authenticated : true,
        })
        .when('/all-programs', {
            templateUrl : 'app/views/pages/user/penerima/allprogram.html',
            controller : 'allprogramsController',
            controllerAs : 'program',
            authenticated : true,
        })
        .otherwise({ redirectTo : '/' });
        $locationProvider.html5Mode({
        enabled : true,
        requireBase : false
    })
});
app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User){
    $rootScope.$on('$routeChangeStart', function(event, next, current){
        if(next.$$route.authenticated == true){
            if(Auth.isLoggedIn() == false){
                event.preventDefault();
                $location.path('/');
            }
        }
        else if(next.$$route.authenticated == false) {
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/profile');
            }
        }
    })
}])
