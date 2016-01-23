app.controller( 'gridCtrl', function( $scope, AppModel, GridService, SocketService ) {

    $scope.model = AppModel;

    SocketService.connect( 'http://localhost:4200' );

    SocketService.on( 'connect', function( data ) {
        SocketService.emit( 'join', 'Hello World from client' );
    } );

    SocketService.on( 'posts', function( data ) {
        $scope.model.posts = JSON.parse( data );
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

} );
