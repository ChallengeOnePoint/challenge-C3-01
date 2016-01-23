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
