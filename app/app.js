var app = angular.module("app", ["ngRoute", "ui.bootstrap", "checklist-model"])

app.filter('beginning_data', function(){
    return function(input, begin){
        if (input) {
            begin = +begin
            return input.slice(begin)
        }
        return []
    }
})

app.config(['$routeProvider', "$locationProvider", function($routeProvider, $locationProvider){
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/dashboard', {
        controller: 'dashboardController',
        templateUrl: 'views/layouts/dashboard.html',
        activetab: "dashboard"
    })
    .when('/revision_documentos', {
        controller: 'revisionController',
        templateUrl: 'views/layouts/revision_documentos.html',
        activetab: "revision_documentos"
    })
    .when('/traslado_documentos', {
        controller: 'trasladoController',
        templateUrl: 'views/layouts/traslado_documentos.html',
        activetab: "traslado_documentos"
    })
    .when('/cumplimiento_plazos', {
        controller: 'plazosController',
        templateUrl: 'views/layouts/cumplimiento_plazos.html',
        activetab: "cumplimiento_plazos"
    })
    .when('/configuracion', {
        controller: 'configuracionController',
        templateUrl: 'views/layouts/configuracion.html',
        activetab: "configuracion"
    })
    .otherwise({redirectTo:'/dashboard'})

}])

app.run(function ($rootScope, $route) {
    $rootScope.$route = $route;
})

app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.hover(function(){
                // on mouseenter
                element.tooltip('show');
            }, function(){
                // on mouseleave
                element.tooltip('hide');
            });
        }
    };
});