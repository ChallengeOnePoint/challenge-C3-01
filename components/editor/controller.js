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
