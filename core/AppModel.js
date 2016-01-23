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
