'use strict';

var express = require( 'express' );
var server;
var io;

module.exports = class Server {

    constructor( opt ) {
        this.setApp();
        this.setServer();
        this.socket()
        this.setStaticFolder();
        this.setRoute();
        this.app.listen( opt.port );
        console.log( 'Server started on http://localhost:' + opt.port );
    }

    setApp() {
        this.app = express();
    }

    setStaticFolder() {
        this.app.use( express.static( __dirname + '/www/' ) );
    }

    setRoute() {
        this.app.get( '/api/example', function( req, res ) {
            res.end( JSON.stringify( {
                example: "Hello from API!!"
            } ) );
        } ).get( '/*', function( req, res ) {
            res.sendFile( __dirname + '/www/index.html' );
        } );
    }

    setServer() {
        server = require('http').createServer(this.app);  
        io = require('socket.io')(server);
        server.listen(4200); 
    }

    socket() {

        io.on('connection', function(client) {  
            console.log('Client connected...');

            var post_counter = 2;

            var posts = {
                0: { 
                    lock: false,
                    title: "test",
                    data: "hello kelu"
                },
                1: { 
                    lock: false,
                    title: "test2",
                    data: "hello Damien"
                }
            }

            client.on('join', function(data) {
                client.emit('posts', JSON.stringify(posts));
                console.log(data);
            });

            client.on('blockPost', function(data) {
                console.log("Post-it blocked!");

            })

            client.on('messages', function(data) {
                   client.emit('broad', data);
                   client.broadcast.emit('broad',data);
            });

        });

    }

};
