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

        posts: {},

        currentPost: null

    };

} );

app.factory( 'SocketService', function( socketFactory ) {

    return socketFactory();

} );

app.controller( 'editorCtrl', function( $scope, AppModel, SocketService ) {

    $scope.model = AppModel;

    $scope.save = function() {
        $scope.model.currentPost.lock = false;
        if ( $scope.model.currentPost.id ) {
            SocketService.emit( 'update', JSON.stringify( $scope.model.currentPost ) );
        } else {
            SocketService.emit( 'create', JSON.stringify( $scope.model.currentPost ) );
        }
        $scope.model.currentPost = null;
    };

    $scope.cancel = function( id ) {
        SocketService.emit( 'update', id );
        $scope.model.posts[ id ].lock = false;
        $scope.model.currentPost = null;
    };

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

app.controller( 'gridCtrl', function( $scope, AppModel, GridService, SocketService ) {

    $scope.model = AppModel;

    SocketService.connect( 'http://localhost:4200' );

    SocketService.on( 'connect', function( data ) {
        SocketService.emit( 'join', 'Hello World from client' );
    } );

    SocketService.on( 'posts', function( data ) {
        $scope.model.posts = JSON.parse( data );
        $scope.$apply();
    } );

    SocketService.on( 'blockPost', function( id ) {
        $scope.model.posts[ id ].lock = true;
        $scope.$apply();
    } );

    $scope.edit = function( id, post ) {
        SocketService.emit( 'blockPost', id );
        post.id = id;
        post.lock = true;
        $scope.model.currentPost = post;
    };

    $scope.delete = function( id ) {
        SocketService.emit( 'delete', id );
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
