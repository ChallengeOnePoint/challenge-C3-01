var app = angular.module( 'Application', [ 'ngRoute', 'btford.socket-io' ] );

app.config( function( $routeProvider, $locationProvider ) {

    $routeProvider.when( '/', {
        templateUrl: 'templates/home.html'
    } ).otherwise( {
        redirectTo: '/'
    } );

    $locationProvider.html5Mode( {
        enabled: true,
        requireBase: false
    } );

} );

app.factory( 'AppModel', function() {

    return {

        posts: [ {
            title: "test title",
            description: "test description"
        }, {
            title: "test title",
            description: "test description"
        } ],

        currentPost: null

    };

} );

app.factory( 'SocketService', function( socketFactory ) {

    return socketFactory();

} );

app.controller( 'exampleCtrl', function( $scope, AppModel, ExampleService ) {

    $scope.test = "Example component";

    $scope.model = AppModel;

    ExampleService.getExample();

} );

app.directive( 'example', function() {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/example/template.html'
    };

} );

app.factory( 'ExampleService', function( $http, AppModel ) {

    return {

        getExample: function() {
            $http.get( '/api/example' ).then( function( resp ) {
                AppModel.example = resp.data.example
            }, function( err ) {
                console.log( err );
            } );
        }

    };

} );

app.controller( 'editorCtrl', function( $scope, AppModel, EditorService ) {

    $scope.model = AppModel;

} );

app.directive( 'editor', function() {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/editor/template.html'
    };

} );

app.factory( 'EditorService', function( $http, AppModel ) {

    return {

        getExample: function() {
            $http.get( '/api/example' ).then( function( resp ) {
                AppModel.example = resp.data.example
            }, function( err ) {
                console.log( err );
            } );
        }

    };

} );

app.controller( 'gridCtrl', function( $scope, AppModel, GridService, SocketService ) {

    $scope.model = AppModel;

    SocketService.connect( 'http://localhost:4200' );

    SocketService.on( 'connect', function( data ) {
        SocketService.emit( 'join', 'Hello World from client' );
    } );

    $scope.edit = function( post ) {
        $scope.model.currentPost = post;
    };

} );

app.directive( 'grid', function() {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/grid/template.html'
    };

} );

app.factory( 'GridService', function( $http, AppModel, SocketService ) {

    console.log( SocketService );

    return {

        getExample: function() {
            $http.get( '/api/example' ).then( function( resp ) {
                AppModel.example = resp.data.example
            }, function( err ) {
                console.log( err );
            } );
        }

    };

} );
