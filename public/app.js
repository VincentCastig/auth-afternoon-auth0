angular.module('myApp', [ui.router])
  .config(function($stateProvider, $urlRouterProvider){

    $stateProvider
    .state('login', {
      url:'/',
      templateUrl: 'public/templates/login.html'
    })
    .state('home', {
      url:'/home',
      templateUrl:'public/templates/home.html'
    })
    .state('friend', {
      url:'/friend',
      templateUrl:'public/templates/friend.html'
    })
    $urlRouterProvider
    .otherwise('/')
  })
