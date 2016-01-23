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
