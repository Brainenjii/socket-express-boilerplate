"use strict";

var me,
	serverHelper = require( "../helper/server" );

me = module.exports = {
	init: function init () {

		serverHelper.registerRoute( me, __filename, {
			test: {
				get: me.getError,
				post: me.getTest
			}
		} );

	},
	getTest: function getTest ( request, callback ) {

		callback( null, {response: request.data} );

	},
	getError: function getError ( request, callback ) {

		callback( request.data );

	}

};
