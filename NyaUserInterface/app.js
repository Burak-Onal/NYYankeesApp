//app
var app = angular.module('app', ['ui.router']);
app.controller('siteInitController', siteInitController)
//app

//factory
app.factory('dataService', function ($http, $q) {
    var service = {}
    service.teams = []
    service.players = []
    

    service.GetTeamList = function (start, end) {
        $http.get("http://localhost:52398/api/team/" + start + "/" + end)
            .then(function (response) {
                if (response.data !== null) {
                    response.data.forEach(function (item) {
                        service.teams.push(item);
                    });
                };
            });
    };

    service.GetPlayersByTeam = function (teamId, start, end) {
        $http.get("http://localhost:52398/api/player/byteam/" + teamId + "/" + start + "/" + end)
            .then(function (response) {
                if (response.data !== null) {
                    response.data.forEach(function (item) {
                        service.players.push(item);
                    });
                };
            });
    };

    service.GetPlayerPstats = function (playerId) {
        var deferred = $q.defer();
        $http.get("http://localhost:52398/api/player/" + playerId + "/pstats")
            .then(function (success) {
                deferred.resolve(success.data)
            });

        return deferred.promise;
    };

    service.GetPlayerBstats = function (playerId) {
        var deferred = $q.defer();
        $http.get("http://localhost:52398/api/player/" + playerId + "/bstats")
            .then(function (success) {
                deferred.resolve(success.data)
            });

        return deferred.promise;
    };

    service.SearchPlayers = function (firstName, lastName) {
        $http.get("http://localhost:52398/api/player/" + firstName + "/" + lastName)
            .then(function (response) {
                service.players = response.data;
            });
    }

    return service;
});
//factory

//states
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                'content': {
                    template: '<home></home>',
                },
            }
        })
        .state('teams', {
            url: '/teams',
            views: {
                'side-bar': {
                    template: '<teams></teams>',
                },
            }
        })
        .state('search', {
            url: '/search',
            views: {
                'side-bar': {
                    template: '<search></search>'
                },
                'content': {
                    template: '<player-list></player-list>'
                }
            }
        })
        .state('playerList', {
            url: '/player-list',
            views: {
                'side-bar': {
                    template: '<teams></teams>',
                },
                'content': {
                    template: '<player-list></player-list>'
                }
            }
        })
        .state('playersFound', {
            url: '/player-list',
            views: {
                'side-bar': {
                    template: '<teams></teams>',
                },
                'content': {
                    template: '<player-list></player-list>'
                }
            }
        });
});
//states

//directives
app.directive("search", function (dataService) {
    return {
        templateUrl: "search.html",
        controller: searchController,
        link: function (scope, elem, attr) {
            scope.data = dataService;
        }

    };
});
app.directive("teams", function (dataService) {
    return {
        templateUrl: "teams.html",
        controller: teamsController,
        link: function (scope, elem, attr) {
            scope.data = dataService;
        }
    };
});
app.directive("playerList", function (dataService) {
    return {
        templateUrl: "player-list.html",
        controller: playerListController,
        link: function (scope, elem, attr) {
            scope.data = dataService;
        }
    };
});
app.directive("home", function () {
    return {
        templateUrl: "home.html",
    };
});
//directives

//controller Functions
function siteInitController($state, $scope, dataService) {
    $scope.teamList = {}
    $scope.playerList = {}
    $scope.teamList.init = false;
    $scope.playerList.init = false;
    $scope.selectedTeamId = 0;
    $scope.teamList.start = 0;
    $scope.teamList.end = 10;
    $state.go('home');
}

function teamsController(dataService, $scope) {
    dataService.players = [];
    dataService.pstats = null;

    $scope.teamList.LoadMore = function () {
        dataService.GetTeamList($scope.teamList.start, $scope.teamList.end)
        $scope.teamList.start = $scope.teamList.start + 10
        $scope.teamList.end = $scope.teamList.end + 10
    };

    if ($scope.teamList.init === false) {
        $scope.teamList.LoadMore()
        $scope.teamList.init = true
    };

    $scope.GetPlayerList = function (team) {
        var teamId = team.teamid
        if (teamId != dataService.selectedTeamId) {
            dataService.players = []
        }

        dataService.selectedTeamId = teamId;
        dataService.selectedTeamName = team.name;

        $scope.playerList.start = 0;
        $scope.playerList.end = 10;

        $scope.playerList.LoadMore = function () {
            dataService.GetPlayersByTeam(dataService.selectedTeamId, $scope.playerList.start, $scope.playerList.end)
            $scope.playerList.start = $scope.playerList.start + 10
            $scope.playerList.end = $scope.playerList.end + 10
        };

        $scope.playerList.LoadMore(dataService.selectedTeamId)
        dataService.displayLoadMorePlayers = true
    };
};

function playerListController(dataService, $scope) {
     $scope.GetPlayerStats = function (player) {
        $scope.playerStats = []
        var currentTime = new Date()
        var bstats = [];
        var pstats = [];
        var ds = dataService
        var p = player;
        dataService.selectedPlayer = player;

        if (p.position >= 2 && p.position <= 10) {
            ds.GetPlayerBstats(p.playerid).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    var bs = result[i]
                    if (bs.yearid == currentTime.getFullYear() || bs.yearid == currentTime.getFullYear() - 1 || bs.yearid == currentTime.getFullYear() - 2) {
                        $scope.playerStats.push({
                            Year: bs.yearid,
                            Games: bs.g,
                            AtBats: bs.ab,
                            Hits: bs.b1 + bs.b2 + bs.b3 + bs.hr,
                            StrikeOuts: bs.so,
                            Walks: bs.ubb + bs.ibb,
                            AVG: bs.b1 + bs.b2 + bs.b3 + bs.hr,
                            OBP: (bs.b1 + bs.b2 + bs.b3 + bs.hr + bs.ubb + bs.ibb + bs.hbp) + (bs.ab + bs.ubb + bs.ibb + bs.hbp + bs.sf),
                            SLG: (bs.b1 + 2 * bs.b2 + 3 * bs.b3 + 4 * bs.hr) / bs.ab,
                            OPS: ((bs.b1 + bs.b2 + bs.b3 + bs.hr + bs.ubb + bs.ibb + bs.hbp) + (bs.ab + bs.ubb + bs.ibb + bs.hbp + bs.sf)) +
                                ((bs.b1 + 2 * bs.b2 + 3 * bs.b3 + 4 * bs.hr) / bs.ab)
                        });
                    }
                }
            });
        }
        else {
            ds.GetPlayerPstats(p.playerid).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    var ps = result[i]
                    if (ps.yearid == currentTime.getFullYear() || ps.yearid == currentTime.getFullYear() - 1 || ps.yearid == currentTime.getFullYear() - 2) {
                        $scope.playerStats.push({
                            Year: ps.yearid,
                            Games: ps.g,
                            GamesStarted: ps.gs,
                            WinsLosesSaves: "" + ps.w + " - " + ps.l + " - " + ps.sv,
                            InningsPitched: "?",
                            Hits: ps.b1 + ps.b2 + ps.b3 + ps.hr,
                            StrikeOuts: ps.so,
                            Walks: ps.ubb + ps.ibb,
                            ERA: (ps.er * 27.0) / ps.outs
                        });
                    }
                }
            });
        }
    }
};

function searchController(dataService) {
    dataService.players = null
    dataService.pstats = null
    dataService.displayLoadMorePlayers = false
};
//controllers