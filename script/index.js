var app = angular.module('App', []);

app.run(function($rootScope){
    
})

app.controller('Home', function ($scope, $rootScope) {
    $scope.showMarkers = true;
    $scope.showRoutes = false;
    $scope.showCrosses = false;
    
    $('#showMarkers').on('click', function () {
        $scope.$apply(function(){
            $scope.showMarkers = true;
            $scope.showRoutes = false;
            $scope.showCrosses = false;
        }); 
    })
    
    $('#showRoutes').on('click', function () {
        $scope.$apply(function(){
            $scope.showMarkers = false;
            $scope.showRoutes = true;
            $scope.showCrosses = false;
        }); 
    })
    
    $('#showCrosses').on('click', function () {
        $scope.$apply(function(){
            $scope.showMarkers = false;
            $scope.showRoutes = false;
            $scope.showCrosses = true;
        });        
    })
});

app.controller('AddMarker', function ($scope, $rootScope) {
    function init_map() {
        var var_mapoptions = {
            center: new google.maps.LatLng(33.889485, 35.498957)
            , zoom: 13
        };

        var var_map = new google.maps.Map(document.getElementById("map-container"), var_mapoptions);
    }
    google.maps.event.addDomListener(window, 'load', init_map);
    
    $scope.marker = {
        id : -1,
        title : "",
        route : "",
        lat : "",
        long : ""
    }
    
    $('#addMarker').on('click', function () {
        $rootScope.markers.push($scope.marker);
        $scope.changeView
    })
});

app.controller('AddRoute', function ($scope, $rootScope) {
    $scope.route = {
        id : 0   
    };
});

app.controller('MakeCross', function ($scope, $rootScope) {
    $scope.crossMarkers = [];
});