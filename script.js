var app = angular.module('App', ['ngRoute']);

app.run(function ($rootScope) {
    $rootScope.markers = [];
    $rootScope.routes = [];
    $rootScope.crosses = [];

    $rootScope.welcomePage = true;
    
    $rootScope.markerID = 0;
    $rootScope.routeID = 0;
    $rootScope.crossID = 0;

    var settings = {
        "url": "http://Transit.kebbeblaban.com:8080/transit/transitjson/markers"
        , "method": "POST"
        , "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    $.ajax(settings).done(function (response) {
        $rootScope.markers = response;
        for (var i = 0; i < $rootScope.markers.length; i++) {
            if (parseInt($rootScope.markers[i].id) > $rootScope.markerID) {
                $rootScope.markerID = parseInt($rootScope.markers[i].id)
            }
        }
        $rootScope.markerID++;
    });

    settings = {
        "url": "http://Transit.kebbeblaban.com:8080/transit/transitjson/routes"
        , "method": "POST"
        , "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    $.ajax(settings).done(function (response) {
        $rootScope.routes = response;
        for (var i = 0; i < $rootScope.routes.length; i++) {
            if (parseInt($rootScope.routes[i].id) > $rootScope.routeID) {
                $rootScope.routeID = parseInt($rootScope.routes[i].id)
            }
        }
        $rootScope.routeID++;
    });

    settings = {
        "url": "http://Transit.kebbeblaban.com:8080/transit/transitjson/crosses"
        , "method": "POST"
        , "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    $.ajax(settings).done(function (response) {
        $rootScope.crosses = response;
        for (var i = 0; i < $rootScope.crosses.length; i++) {
            if (parseInt($rootScope.crosses[i].id) > $rootScope.crossID) {
                $rootScope.crossID = parseInt($rootScope.crosses[i].id)
            }
        }
        $rootScope.crossID++;
    });
})

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'views/home.html'
            , controller: 'mainController'
        })
        .when('/addmarker', {
            templateUrl: 'views/addmarker.html'
            , controller: 'addmarkerController'
        })
        .when('/addroute', {
            templateUrl: 'views/addroute.html'
            , controller: 'addrouteController'
        })
        .when('/makecross', {
            templateUrl: 'views/makecross.html'
            , controller: 'makecrossController'
        })
        .when('/editmarker', {
            templateUrl: 'views/editmarker.html'
            , controller: 'editmarkerController'
        })
        .when('/editroute', {
            templateUrl: 'views/editroute.html'
            , controller: 'editrouteController'
        })
        .when('/editcross', {
            templateUrl: 'views/editcross.html'
            , controller: 'editcrossController'
        })
        .when('/map', {
            templateUrl: 'views/map.html'
            , controller: 'mapController'
        });

    $locationProvider.html5Mode(true);
})

app.controller('mainController', function ($scope, $rootScope, $location, $http) {
    if ($rootScope.welcomePage){
        $scope.showMarkers = false;
    }
    else {
        $scope.showMarkers = true;
    }
    $scope.showRoutes = false;
    $scope.showCrosses = false;

    $scope.update_failed = false;

    $scope.changeView = function (view) {
        $location.path(view);
    }

    $scope.delete = function (data, object) {
        if (data == 'marker') {
            var index = $rootScope.markers.indexOf(object);
            $rootScope.markers.splice(index, 1);
            for (i = 0; i < $rootScope.routes.length; i++) {
                index = $rootScope.routes[i].markers.indexOf(object.id);
                if (index != -1) {
                    $rootScope.routes[i].markers.splice(index, 1);
                }
            }

            for (i = 0; i < $rootScope.crosses.length; i++) {
                index = $rootScope.crosses[i].markers.indexOf(object.id);
                if (index != -1) {
                    $rootScope.crosses[i].markers.splice(index, 1);
                }
            }

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.update_failed = false;
                    });
                })
                .fail(function (response) {
                    $rootScope.markers.push(object);
                    $rootScope.routes.push(object);
                    $rootScope.crosses.push(object);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                    });
                });
        } else if (data == 'route') {
            var index = $rootScope.routes.indexOf(object);
            $rootScope.routes.splice(index, 1);

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.update_failed = false;
                    });
                })
                .fail(function (response) {
                    $rootScope.routes.push(object);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                    });
                });
        } else if (data == 'cross') {
            var index = $rootScope.crosses.indexOf(object);
            $rootScope.crosses.splice(index, 1);

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.update_failed = false;
                    });
                })
                .fail(function (response) {
                    $rootScope.crosses.push(object);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                    });
                });
        }
    }

    $scope.edit = function (data, object) {
        if (data == 'marker') {
            $location.path('/editmarker').search({
                id: object.id
            });
        } else if (data == 'route') {
            $location.path('/editroute').search({
                id: object.id
            });
        } else if (data == 'cross') {
            $location.path('/editcross').search({
                id: object.id
            });
        }
    }

    $scope.findByID = function (input, id) {
        var i = 0
            , len = input.length;
        for (; i < len; i++) {
            if (input[i].id == id) {
                return input[i];
            }
        }
        return null;
    }

    $scope.findIndexByID = function (input, id) {
        var i = 0
            , len = input.length;
        for (; i < len; i++) {
            if (input[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    $scope.findByValue = function (input, value) {
        var i = 0
            , len = input.length;
        for (; i < len; i++) {
            if (input[i] == value) {
                return input[i];
            }
        }
        return null;
    }

    $('#showMarkers').on('click', function () {
        $scope.$apply(function () {
            $rootScope.welcomePage = false;
            $scope.showMarkers = true;
            $scope.showRoutes = false;
            $scope.showCrosses = false;
        });
    })

    $('#showRoutes').on('click', function () {
        $scope.$apply(function () {
            $rootScope.welcomePage = false;
            $scope.showMarkers = false;
            $scope.showRoutes = true;
            $scope.showCrosses = false;
        });
    })

    $('#showCrosses').on('click', function () {
        $scope.$apply(function () {
            $rootScope.welcomePage = false;
            $scope.showMarkers = false;
            $scope.showRoutes = false;
            $scope.showCrosses = true;
        });
    })
});

app.controller('addmarkerController', function ($scope, $rootScope) {
    $scope.error_markerexists = false;
    $scope.info_success = false;
    $scope.update_failed = false;
    var map_marker = null;

    $scope.route = "";

    $scope.marker = {
        id: null
        , title: ""
        , lat: null
        , long: null
    };

    $('#addMarker').on('click', function () {
        var object = $scope.findByID($rootScope.markers, $scope.marker.id);
        if (object == null) {
            $scope.marker.id = $rootScope.markerID;
            $rootScope.markerID = $rootScope.markerID + 1;
            $scope.marker.title = $scope.marker.title + "-" + $scope.route;
            $rootScope.markers.push(angular.copy($scope.marker));

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.error_markerexists = false;
                        $scope.info_success = true;
                        $scope.update_failed = false;
                        $scope.marker = {
                            id: null
                            , title: ""
                            , lat: null
                            , long: null
                        };
                    });
                })
                .fail(function (response) {
                    var index = $scope.findIndexByID($rootScope.markers, $scope.marker.id);
                    $rootScope.markers.splice(index, 1);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                    });
                });

        } else {
            $scope.$apply(function () {
                $scope.error_markerexists = true;
                $scope.info_success = false;
            });
        }
    })

    function init_map() {
        var var_location = new google.maps.LatLng(33.888808, 35.502574);

        var var_mapoptions = {
            center: var_location
            , zoom: 12
        };

        var var_map = new google.maps.Map(document.getElementById("map-container")
            , var_mapoptions);

        var_map.addListener('click', function (e) {
            $scope.marker.lat = e.latLng.lng();
            $scope.marker.long = e.latLng.lat();

            if (map_marker != null) {
                map_marker.setMap(null);
            }

            map_marker = new google.maps.Marker({
                position: e.latLng
                , map: var_map
            });

            map_marker.setMap(var_map);
        })

    }

    init_map();
});

app.controller('addrouteController', function ($scope, $rootScope) {
    $scope.error_routeexists = false;
    $scope.info_success = false;
    $scope.update_failed = false;

    $scope.route = {
        id: null
        , number: ""
        , markers: []
    }

    $scope.currentMarkers = [];
    $scope.selectedMarker = null;

    $('#addRoute').on('click', function () {
        var object = $scope.findByID($rootScope.routes, $scope.route.id);
        if (object == null) {
            $scope.route.id = $rootScope.routeID;
            $rootScope.routeID = $rootScope.routeID + 1;
            $rootScope.routes.push(angular.copy($scope.route));

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.error_routeexists = false;
                        $scope.info_success = true;
                        $scope.route = {
                            id: null
                            , number: ""
                            , markers: []
                        }
                    });
                })
                .fail(function (response) {
                    var index = $scope.findIndexByID($rootScope.routes, $scope.route.id);
                    $rootScope.routes.splice(index, 1);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                    });
                });
        } else {
            $scope.$apply(function () {
                $scope.error_routeexists = true;
                $scope.info_success = false;
            });
        }
    })

    $scope.addR = function add() {
        if ($scope.selectedMarker != null) {
            var object = $scope.findByValue($scope.route.markers, $scope.selectedMarker.id);
            if (object == null) {
                $scope.route.markers.push($scope.selectedMarker.id);
                $scope.currentMarkers = [];
                $scope.selectedMarker = null;

                for (i = 0; i < $scope.route.markers.length; i++) {
                    for (j = 0; j < $rootScope.markers.length; j++) {
                        if (parseInt($rootScope.markers[j].id) == parseInt($scope.route.markers[i])) {
                            $scope.currentMarkers.push($rootScope.markers[j]);
                        }
                    }
                }
            } else {
                $scope.error_routeexists = true;
            }
        }
    }

    $scope.moveUp = function (marker) {
        var index = $scope.route.markers.indexOf(marker.id);
        if (index != -1 && index - 1 >= 0) {
            temp = angular.copy($scope.route.markers[index]);
            $scope.route.markers[index] = angular.copy($scope.route.markers[index - 1]);
            $scope.route.markers[index - 1] = angular.copy(temp);

            temp = angular.copy($scope.currentMarkers[index]);
            $scope.currentMarkers[index] = angular.copy($scope.currentMarkers[index - 1]);
            $scope.currentMarkers[index - 1] = angular.copy(temp);
        }
    }

    $scope.moveDown = function (marker) {
        var index = $scope.route.markers.indexOf(marker.id);
        if (index != -1 && index + 1 < $scope.route.markers.length) {
            temp = angular.copy($scope.route.markers[index]);
            $scope.route.markers[index] = angular.copy($scope.route.markers[index + 1]);
            $scope.route.markers[index + 1] = angular.copy(temp);

            temp = angular.copy($scope.currentMarkers[index]);
            $scope.currentMarkers[index] = angular.copy($scope.currentMarkers[index + 1]);
            $scope.currentMarkers[index + 1] = angular.copy(temp);
        }
    }

    $scope.delete = function (marker) {
        var index = $scope.route.markers.indexOf(marker.id);
        if (index != -1) {
            $scope.route.markers.splice(index, 1);
            $scope.currentMarkers.splice(index, 1);
        }
    }
});

app.controller('makecrossController', function ($scope, $rootScope) {
    $scope.error_crossexists = false;
    $scope.info_success = false;
    $scope.update_failed = false;

    $scope.cross = {
        id: null
        , name: ""
        , markers: []
    }

    $scope.selectedMarker = null;

    $('#makeCross').on('click', function () {
        $scope.selectedMarker = null;
        var object = $scope.findByID($rootScope.crosses, $scope.cross.id);
        if (object == null) {
            $scope.cross.id = $rootScope.crossID;
            $rootScope.crossID = $rootScope.crossID + 1;
            $rootScope.crosses.push(angular.copy($scope.cross));

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.error_routeexists = false;
                        $scope.info_success = true;
                        $scope.cross = {
                            id: null
                            , name: ""
                            , markers: []
                        }
                    });
                })
                .fail(function (response) {
                    var index = $scope.findIndexByID($rootScope.crosses, $scope.cross.id);
                    $rootScope.crosses.splice(index, 1);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                    });
                });
        } else {
            $scope.$apply(function () {
                $scope.error_routeexists = true;
                $scope.info_success = false;
            });
        }
    })

    $scope.add = function add() {
        $scope.error_crossexists = false;
        if ($scope.selectedMarker != null) {
            var object = $scope.findByValue($scope.cross.markers, $scope.selectedMarker.id);
            if (object == null) {
                $scope.cross.markers.push($scope.selectedMarker.id);
                $scope.currentMarkers = [];
                $scope.selectedMarker = null;

                for (i = 0; i < $scope.cross.markers.length; i++) {
                    for (j = 0; j < $rootScope.markers.length; j++) {
                        if ($rootScope.markers[j].id == $scope.cross.markers[i]) {
                            $scope.currentMarkers.push($rootScope.markers[j]);
                        }
                    }
                }
            } else {
                $scope.error_crossexists = true;
            }
        }
    }

    $scope.delete = function (marker) {
        var index = $scope.cross.markers.indexOf(marker.id);
        if (index != -1) {
            $scope.cross.markers.splice(index, 1);
            $scope.currentMarkers.splice(index, 1);
        }
    }
});

app.controller('editmarkerController', function ($scope, $rootScope, $location, $filter) {
    var map_marker = null;
    $scope.error_notmarkerexists = false;
    $scope.info_success = false;
    $scope.update_failed = false;

    var query = $location.search();
    $scope.oldMarker = $scope.findByID($rootScope.markers, query.id);
    $scope.currentMarker = angular.copy($scope.oldMarker);

    $scope.currentTitle = $scope.currentMarker.title.split("-")[0];
    $scope.currentRoute = $scope.currentMarker.title.split("-")[1];

    $scope.editMarker = function () {
        $scope.currentMarker.title = $scope.currentTitle + "-" + $scope.currentRoute;
        var index = $rootScope.markers.indexOf($scope.oldMarker);
        if (index != -1) {
            $rootScope.markers[index] = angular.copy(angular.copy($scope.currentMarker));

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.error_notmarkerexists = false;
                        $scope.info_success = true;
                    });
                })
                .fail(function (response) {
                    $rootScope.markers[index] = angular.copy($scope.oldMarker);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                        $scope.info_success = true;
                    });
                });
        } else {
            $scope.error_notmarkerexists = true;
        }
    }

    $scope.revertChanges = function () {
        $scope.currentMarker = angular.copy($scope.oldMarker);
        $scope.currentTitle = $scope.currentMarker.title.split("-")[0];
        $scope.currentRoute = $scope.currentMarker.title.split("-")[1];
    }

    function init_map() {
        if ($scope.currentMarker.lat != null && $scope.currentMarker.long != null) {
            var var_location = new google.maps.LatLng($scope.currentMarker.long, $scope.currentMarker.lat);
        }

        var var_mapoptions = {
            center: var_location
            , zoom: 14
        };

        var var_map = new google.maps.Map(document.getElementById("map-container")
            , var_mapoptions);

        map_marker = new google.maps.Marker({
            position: var_location
            , map: var_map
        });

        map_marker.setMap(var_map);

        var_map.addListener('click', function (e) {
            $scope.currentMarker.lat = e.latLng.lng();
            $scope.currentMarker.long = e.latLng.lat();

            if (map_marker != null) {
                map_marker.setMap(null);
            }

            map_marker = new google.maps.Marker({
                position: e.latLng
                , map: var_map
            });

            map_marker.setMap(var_map);
        })

    }

    init_map();
});

app.controller('editrouteController', function ($scope, $rootScope, $location, $filter) {
    $scope.info_success = false;
    $scope.error_notrouteexists = false;
    $scope.update_failed = false;

    var query = $location.search();
    $scope.oldRoute = $scope.findByID($rootScope.routes, query.id);
    $scope.currentRoute = angular.copy($scope.oldRoute);

    $scope.currentMarkers = [];
    $scope.selectedMarker = null;

    for (i = 0; i < $scope.currentRoute.markers.length; i++) {
        for (j = 0; j < $rootScope.markers.length; j++) {
            if (parseInt($scope.currentRoute.markers[i]) == parseInt($rootScope.markers[j].id)) {
                $scope.currentMarkers.push($rootScope.markers[j]);
            }
        }
    }

    $scope.editRoute = function () {
        var index = $rootScope.routes.indexOf($scope.oldRoute);
        if (index != -1) {
            $rootScope.routes[index] = angular.copy($scope.currentRoute);

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.error_notrouteexists = false;
                        $scope.info_success = true;
                    });
                })
                .fail(function (response) {
                    $rootScope.routes[index] = angular.copy($scope.oldRoute);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                        $scope.info_success = true;
                    });
                });
        } else {
            $scope.error_notrouteexists = true;
            $scope.info_success = false;
        }
    }

    $scope.revertChangesR = function () {
        $scope.currentRoute = angular.copy($scope.oldRoute);
    }

    $scope.addR = function add() {
        if ($scope.selectedMarker != null) {
            var object = $scope.findByValue($scope.currentRoute.markers, $scope.selectedMarker.id);
            if (object == null) {
                $scope.currentRoute.markers.push($scope.selectedMarker.id);
                $scope.currentMarkers = [];
                $scope.selectedMarker = null;

                for (i = 0; i < $scope.currentRoute.markers.length; i++) {
                    for (j = 0; j < $rootScope.markers.length; j++) {
                        if (parseInt($scope.currentRoute.markers[i]) == parseInt($rootScope.markers[j].id)) {
                            $scope.currentMarkers.push($rootScope.markers[j]);
                        }
                    }
                }
            } else {
                $scope.error_routeexists = true;
            }
        }
    }

    $scope.moveUp = function (marker) {
        var index = $scope.currentRoute.markers.indexOf(marker.id);
        if (index != -1 && index - 1 >= 0) {
            temp = angular.copy($scope.currentRoute.markers[index]);
            $scope.currentRoute.markers[index] = angular.copy($scope.currentRoute.markers[index - 1]);
            $scope.currentRoute.markers[index - 1] = angular.copy(temp);

            temp = angular.copy($scope.currentMarkers[index]);
            $scope.currentMarkers[index] = angular.copy($scope.currentMarkers[index - 1]);
            $scope.currentMarkers[index - 1] = angular.copy(temp);
        }
    }

    $scope.moveDown = function (marker) {
        var index = $scope.currentRoute.markers.indexOf(marker.id);
        if (index != -1 && index + 1 < $scope.currentRoute.markers.length) {
            temp = angular.copy($scope.currentRoute.markers[index]);
            $scope.currentRoute.markers[index] = angular.copy($scope.currentRoute.markers[index + 1]);
            $scope.currentRoute.markers[index + 1] = angular.copy(temp);

            temp = angular.copy($scope.currentMarkers[index]);
            $scope.currentMarkers[index] = angular.copy($scope.currentMarkers[index + 1]);
            $scope.currentMarkers[index + 1] = angular.copy(temp);
        }
    }

    $scope.delete = function (marker) {
        var index = $scope.currentRoute.markers.indexOf(marker.id);
        if (index != -1) {
            $scope.currentRoute.markers.splice(index, 1);
            $scope.currentMarkers.splice(index, 1);
        }
    }
});

app.controller('editcrossController', function ($scope, $rootScope, $location, $filter) {
    $scope.error_crossexists = false;
    $scope.info_success = false;
    $scope.error_notcrossexists = false;
    $scope.update_failed = false;

    var query = $location.search();
    $scope.oldCross = $scope.findByID($rootScope.crosses, query.id);
    $scope.currentCross = angular.copy($scope.oldCross);

    $scope.currentMarkers = [];
    $scope.selectedMarker = null;

    for (i = 0; i < $scope.currentCross.markers.length; i++) {
        for (j = 0; j < $rootScope.markers.length; j++) {
            if ($scope.currentCross.markers[i] == $rootScope.markers[j].id) {
                $scope.currentMarkers.push($rootScope.markers[j]);
            }
        }
    }

    $scope.editCross = function () {
        var index = $rootScope.crosses.indexOf($scope.oldCross);
        if (index != -1) {
            $rootScope.crosses[index] = angular.copy($scope.currentCross);

            var settings = {
                "url": "http://transit.kebbeblaban.com:8080/transit/inteltransit/"
                , "method": "POST"
                , "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                , "data": {
                    json_data: JSON.stringify({
                        markers: $rootScope.markers
                        , routes: $rootScope.routes
                        , crosses: $rootScope.crosses
                    })
                }
            }

            $.ajax(settings)
                .done(function (response) {
                    $scope.$apply(function () {
                        $scope.error_notcrossexists = false;
                        $scope.info_success = true;
                    });
                })
                .fail(function (response) {
                    $rootScope.crosses[index] = angular.copy($scope.oldCross);
                    $scope.$apply(function () {
                        $scope.update_failed = true;
                        $scope.info_success = true;
                    });
                });
        } else {
            $scope.error_notcrossexists = true;
            $scope.info_success = false;
        }
    }

    $scope.revertChangesC = function () {
        $scope.currentCross = angular.copy($scope.oldCross);
    }

    $scope.add = function add() {
        $scope.error_crossexists = false;
        if ($scope.selectedMarker != null) {
            var object = $scope.findByValue($scope.currentCross.markers, $scope.selectedMarker.id);
            if (object == null) {
                $scope.currentCross.markers.push($scope.selectedMarker.id);
                $scope.currentMarkers = [];
                $scope.selectedMarker = null;

                for (i = 0; i < $scope.currentCross.markers.length; i++) {
                    for (j = 0; j < $rootScope.markers.length; j++) {
                        if ($rootScope.markers[j].id == $scope.currentCross.markers[i]) {
                            $scope.currentMarkers.push($rootScope.markers[j]);
                        }
                    }
                }
            } else {
                $scope.error_crossexists = true;
            }
        }
    }

    $scope.delete = function (marker) {
        var index = $scope.currentCross.markers.indexOf(marker.id);
        if (index != -1) {
            $scope.currentCross.markers.splice(index, 1);
            $scope.currentMarkers.splice(index, 1);
        }
    }
});

app.controller('mapController', function ($scope, $rootScope) {
    $scope.showMap = true;
    $scope.showMarkers = false;
    $scope.showRoutes = false;
    $scope.showCrosses = false;
    function init_map() {
        var var_location = new google.maps.LatLng(33.888808, 35.502574);

        var var_mapoptions = {
            center: var_location
            , zoom: 12
        };

        var var_map = new google.maps.Map(document.getElementById("big-map-container")
            , var_mapoptions);

        var list_of_markers = []

        for (i = 0; i < $rootScope.markers.length; i++) {
            if ($rootScope.markers[i].lat != null && $rootScope.markers[i].long != null) {
                var var_location = new google.maps.LatLng($rootScope.markers[i].long, $rootScope.markers[i].lat);
                map_marker = new google.maps.Marker({
                    title: $rootScope.markers[i].title
                    ,position: var_location
                    , map: var_map
                });

                map_marker.setMap(var_map);
                list_of_markers.push(map_marker);
            }
        }

    }

    init_map();
});