angular.module("myApp").controller('githubCtrl', function ($scope, githubService, $state) {
    $scope.login = function () {
      console.log('logging in');
      githubService.login().then(function (response) {
        if (response.status == 200) {
          console.log('logged in', response);
          $state.go('home')
        }
      })
    }
})
