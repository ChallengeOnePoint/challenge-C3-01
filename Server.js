'use strict';

var express = require( 'express' );
var http = require( 'http' );
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
        server = http.createServer( this.app );
        io = require( 'socket.io' )( server );
        server.listen( 4200 );
    }

    socket() {

        var post_counter = 1;

        var posts = {
            0: {
                lock: false,
                title: "Reminder",
                description: "Learn JS"
            },
            1: {
                lock: false,
                title: "Reminder 2",
                description: "Learn JS ++"
            }
        }

        io.on( 'connection', function( client ) {
            console.log( 'Client connected...' );

            client.on( 'join', function( data ) {
                client.emit( 'posts', JSON.stringify( posts ) );
                console.log( data );
            } );

            client.on( 'blockPost', function( data ) {
                console.log( "Post-it blocked!" );
                posts[data].lock = true;
                client.broadcast.emit( 'blockPost', data );
            } );

            client.on( 'unBlockPost', function( data ) {
                console.log( "Post-it unblocked!" );
                posts[data].lock = false;
                client.broadcast.emit( 'posts', JSON.stringify( posts ) );
            } );

            client.on( 'messages', function( data ) {
                client.emit( 'broad', data );
                client.broadcast.emit( 'broad', data );
            } );

            client.on( 'create', function( data ) {
                post_counter += 1;
                posts[post_counter] = JSON.parse(data)
                client.emit( 'posts', JSON.stringify( posts ) );
                client.broadcast.emit( 'posts', JSON.stringify( posts ) );
            } );

            client.on( 'update', function( data ) {
                var newData = JSON.parse(data);
                var id = newData.id;
                delete newData.id
                posts[id] = newData
                client.emit( 'posts', JSON.stringify( posts ) );
                client.broadcast.emit( 'posts', JSON.stringify( posts ) );
            } );

            client.on( 'delete', function( data ) {
                delete posts[data];
                client.emit( 'posts', JSON.stringify( posts ) );
                client.broadcast.emit( 'posts', JSON.stringify( posts ) );
            } );


        } );

    }

};
