/* global webix */
"use strict";

var me;

me = module.exports = {
	prepareSocket: function prepareSocket ( config, callback ) {

		var el = document.createElement( "script" );

		webix.ajax();

		me.config = config;

		el.src = config.src;
		el.onload = function onLoad () {

			me.socket = window.io.connect( config.socketURI );

			return me.socket.on( "connect", function connectHandler () {

				if ( me.connected ) {

					return;

				}

				me.connected = true;

				console.log( "we are here" );
				callback();

			} );

		};
		document.head.appendChild( el );

	},
	sendAjax: function sendAjax ( method, path, data, callback ) {

		// noinspection JSUnusedGlobalSymbols
		webix.ajax().headers( {
			"Content-Type": "application/json",
			"Data-Type": "json"
		} )[method]( me.config.socketURI + path,
			method === "get" ? data : JSON.stringify( data ), {
				success: function responseHandler ( response ) {

					callback( null, JSON.parse( response ) );

				},
				error: function errorHandler ( error ) {

					console.log( arguments );
					callback( JSON.parse( error ) );

				}
			} );

	},
	sendSocket: function sendSocket ( method, path, data, callback ) {

		if ( !me.socket ) {

			return callback( new Error( "not connected" ) );

		}
		return me.socket.emit( "message", {
			path: path,
			method: method,
			data: data
		}, callback );

	}
};
