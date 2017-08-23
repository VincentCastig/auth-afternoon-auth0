angular.module('myApp').controller('homeCtrl', function ($scope, githubService) {
    githubService.getFollowing().then(function (response) {
      $scope.followers = response;
    })
})
