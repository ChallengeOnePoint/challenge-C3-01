app.controller( 'editorCtrl', function( $scope, AppModel, SocketService ) {

    $scope.model = AppModel;

    $scope.save = function() {
        if ( $scope.model.currentPost.id )
            SocketService.emit( 'update', JSON.stringify( $scope.model.currentPost ) );
        else
            SocketService.emit( 'create', JSON.stringify( $scope.model.currentPost ) );
        $scope.model.currentPost = null;
    };

} );
