"use strict";

var EW = require( "ext-webix" ),
	communicator = require( "../util/communicator" );

EW.defineController( "Demo.controller.MainCtrl", {
	views: [
		require( "../view/Viewport" )
	],
	init: function init () {

		return {
			mainViewport: {
				"#btnSocket": {
					onItemClick: this.sendSocketPing
				},
				"#btnAjax": {
					onItemClick: this.sendAjaxPing
				},
				"#btnSocketErr": {
					onItemClick: this.sendSocketErr
				},
				"#btnAjaxErr": {
					onItemClick: this.sendAjaxErr
				}
			}
		};

	},
	sendSocketPing: function sendSocketPing () {

		var viewport = this.getTopParentView(),
			txtResponse = EW.find( viewport, "#txtResponse" );

		communicator.sendSocket( "post", "/test", {
			data: Math.random()
		}, function responseHandler ( err, data ) {

			txtResponse.setValue( txtResponse.getValue() +
				JSON.stringify( err ) + "\n" +
				JSON.stringify( data ) + "\n" );

		} );

	},
	sendAjaxPing: function sendAjaxPing () {

		var viewport = this.getTopParentView(),
			txtResponse = EW.find( viewport, "#txtResponse" );

		communicator.sendAjax( "post", "/test", {
			data: Math.random()
		}, function responseHandler ( err, data ) {

			txtResponse.setValue( txtResponse.getValue() +
				JSON.stringify( err ) + "\n" +
				JSON.stringify( data ) + "\n" );

		} );

	},
	sendSocketErr: function sendSocketErr () {

		var viewport = this.getTopParentView(),
			txtResponse = EW.find( viewport, "#txtResponse" );

		communicator.sendSocket( "get", "/test", {
			data: Math.random()
		}, function responseHandler ( err, data ) {

			txtResponse.setValue( txtResponse.getValue() +
				JSON.stringify( err ) + "\n" +
				JSON.stringify( data ) + "\n" );

		} );

	},
	sendAjaxErr: function sendAjaxErr () {

		var viewport = this.getTopParentView(),
			txtResponse = EW.find( viewport, "#txtResponse" );

		communicator.sendAjax( "get", "/test", {
			data: Math.random()
		}, function responseHandler ( err, data ) {

			txtResponse.setValue( txtResponse.getValue() +
				JSON.stringify( err ) + "\n" +
				JSON.stringify( data ) + "\n" );

		} );

	}

} );
