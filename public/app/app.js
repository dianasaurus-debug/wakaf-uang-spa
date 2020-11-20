angular.module('wakafApp', ['appRoutes', 'resultController', 'allprogramsController', 'userControllers', 'userServices', 'wakifServices','ngAnimate', 'AuthServices', 'mainController', 'wakifCtrl', 'programController', 'programServices'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});