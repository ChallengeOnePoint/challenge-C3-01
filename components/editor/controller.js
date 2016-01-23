app.controller( 'editorCtrl', function( $scope, AppModel, SocketService ) {

    $scope.model = AppModel;

    $scope.save = function( post ) {
        if ( post.id ) SocketService.emit( 'update', JSON.stringify( post ) );
        else SocketService.emit( 'create', JSON.stringify( post ) );
    };

} );
