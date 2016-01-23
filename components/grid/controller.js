app.controller( 'gridCtrl', function( $scope, AppModel, GridService, SocketService ) {

    $scope.model = AppModel;

    SocketService.connect( 'http://localhost:4200' );

    SocketService.on( 'connect', function( data ) {
        SocketService.emit( 'join', 'Hello World from client' );
    } );

    SocketService.on( 'posts', function( data ) {
        var newPosts = JSON.parse( data ),
            counter = Object.keys( $scope.model.posts ).length,
            newCounter = Object.keys( newPosts ).length;

        if ( newCounter < counter && counter > 0 )
            var notification = new Notification( "A post has been deleted" );
        if ( newCounter > counter && counter > 0 )
            var notification = new Notification( "A post has been created" );
        $scope.model.posts = newPosts;
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
        $scope.model.cancelBackup = angular.copy( post );
        $scope.model.currentPost = post;
    };

    $scope.delete = function( id ) {
        SocketService.emit( 'delete', id );
    };

    Notification.requestPermission( function( permission ) {

        Notification.permission = permission;

    } );

} );
