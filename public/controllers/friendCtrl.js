angular.module('myApp').controller('friendCtrl', function ($scope, $stateParams, githubService) {
  githubService.getActivity($stateParams.github_username).then(function (response) {
    $scope.activity = response;
  })
})
