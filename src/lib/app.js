"use strict";

var EW = require( "ext-webix" ),
	async = require( "async" ),
	communicator = require( "./util/communicator" );

EW.skipLoading = true;

EW.init( {
	window: window,
	webix: window.webix
} );

// noinspection JSUnusedGlobalSymbols
EW.application( {
	name: "Demo",
	loader: false,
	controllers: [
		require( "./controller/MainCtrl" )
	],
	launch: function launch () {

		// noinspection JSUnusedGlobalSymbols
		return async.series( [
			function communicationHandler ( callback ) {

				communicator.prepareSocket( {
					src: "http://localhost:4002/socket.io/socket.io.js",
					socketURI: "http://localhost:4002"
				}, callback );

			}
		], function initHandler () {

			EW.widget( "mainViewport" ).show();

		} );

	}
} );
