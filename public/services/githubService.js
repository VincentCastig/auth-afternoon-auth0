angular.module('myApp').service('githubService', function ($http) {
    this.getFollowing = function () {
      return $http({
        method:'GET',
        url: 'api/github/followers'
      }).then(function (response) {
        return response.data;
      })
    }

    this.getActivity = function (username) {
      return $http({
        method: 'GET',
        url: 'api/github/' + username + '/activity'
      }).then(function (response) {
        return response.data
      })
    }
})
