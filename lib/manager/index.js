"use strict";

module.exports = {
	test: require( "./test" ),

	toArray: function toArray () {

		var field, me = this, result = [];

		for ( field in me ) {

			if ( me.hasOwnProperty( field ) ) {

				if ( typeof me[field] === "object" ) {

					result.push( me[field] );

				}

			}

		}

		return result;

	}
};
