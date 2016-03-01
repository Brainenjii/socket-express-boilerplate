"use strict";

var mongoose,
	socketIO,
	io,
	server,

	_ = require( "lodash" ),
	http = require( "http" ),
	async = require( "async" ),
	bodyParser = require( "body-parser" ),
	cookieParser = require( "cookie-parser" ),
	express = require( "express" ),
	app = express(),
	session = require( "express-session" ),

	serverConfig = require( "./serverConfig" ),
	serverHelper = require( "./lib/helper/server" ),
	managers = require( "./lib/manager" );

app.use( bodyParser.json() );
app.use( cookieParser() );

if ( serverConfig.express.session.active ) {

	app.use( session( {
		secret: "secret",
		resave: false,
		saveUninitialized: false
	} ) );

}

if ( serverConfig.express.cors ) {

	app.use( serverHelper.corsHandler );

}

// noinspection JSUnusedGlobalSymbols
async.series( [function appInitialization ( callback ) {

	if ( serverConfig.mongo.active ) {

		mongoose = require( "mongoose" );
		mongoose.connect( serverConfig.mongo.uri );

	}
	callback();

}, function socketInitialization ( callback ) {

	server = http.createServer( app );

	if ( serverConfig.socket.active ) {

		socketIO = require( "socket.io" );
		io = socketIO( server );
		io.set( "transports", ["websocket", "polling"] );

	}
	serverHelper.init( {
		app: app,
		io: io
	} );
	callback();

}, function managersInitialization ( callback ) {

	async.each( _.sortBy( managers.toArray(), "initWeight" ),
		function managerInitialization ( manager, callback ) {

			if ( manager.init ) {

				manager.init();

			}

			if ( manager.load ) {

				return manager.load( null, callback );

			}

			return callback();

		}, callback );

}], function startPrepare ( err ) {

	if ( err ) {

		// Do your log here
		console.error( err );
		process.exit( 1 );

	}

	app.use( express.static( "dist" ) );

	server.listen( serverConfig.express.port, function startHandler () {

		io.on( "connection", function connectionHandler ( socket ) {

			setInterval( function workaround () {

				socket.emit( "wtf", "wtf" );

			}, 5000 );

			socket.on( "message",
				function messageHandler ( request, callback ) {

					serverHelper.socketHandler( request, socket, callback );

				} );

		} );
		console.log( "all your request are belong to us" );

	} );

} );
