"use strict";

var app,
	io,
	me,
	_ = require( "lodash" ),
	util = require( "util" );

me = module.exports = {
	routes: [],
	init: function init ( env ) {

		app = env.app;
		io = env.io;

	},
	socketHandler: function socketHandler ( request, socket, callback ) {

		var route;

		if ( request.mgr === "support" && request.action === "get" ) {

			return callback( null, {response: "pong"} );

		}

		route = _.find( me.routes, {
			path: request.path,
			method: request.method
		} );
		if ( route ) {

			return route.handler( {
				data: request.data || {},
				socket: socket
			}, callback );

		}

		return callback( new Error( "unable find route" ) );

	},
	ajaxHandler: function ajaxHandler ( req, res ) {

		var field,
			json,
			result;

		for ( field in req.params ) {

			if ( req.params.hasOwnProperty( field ) ) {

				req.args[field] = req.params[field];

			}

		}

		if ( req.body ) {

			_.extend( req.args, req.body );

		}

		if ( req.args.json && req.args.data ) {

			try {

				json = JSON.parse( req.args.data );

			} catch ( err ) {

				res.send( 400, err );

			}

			if ( typeof json === "object" ) {

				_.extend( json, req.args );
				req.args = json;

			} else {

				req.args.info = json || {};

			}

			delete req.args.json;
			delete req.args.data;

		}

		if ( req.files ) {

			_.extend( req.args, {files: req.files} );

		}
		result = this.handler( {
			ip: req.source,
			data: req.args
		}, function resultHandler ( err, data ) {

			if ( res.sended ) {

				return util.debug( "shit was happen" );

			}

			if ( err ) {

				return res.status( err.code || 500 ).send( err );

			}

			return res.status( 200 ).send( typeof data === "object"
				? JSON.stringify( data )
				: data );

		} );

		if ( result !== undefined ) {

			res.sended = true;
			res.json( result );

		}

	},

	corsHandler: function corsHandler ( req, res, next ) {

		var args = {
		};

		_.extend( args, req.query );

		req.args = args;

		req.source = req.headers["x-forwarded-for"] ||
			req.connection.remoteAddress;

		res.header( "Access-Control-Allow-Origin", req.headers.origin );
		res.header( "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE" );
		res.header( "Access-Control-Allow-Credentials", "true" );
		res.header( "Access-Control-Allow-Headers",
			"X-Requested-With,Content-Type,Data-Type" );
		next();

	},

	/**
	 *
	 * @param {Object} manager
	 * @param {String} filename
	 * @param {Object} config
	 * @param {Array} [path]
	 */
	registerRoute: function registerRoute ( manager, filename, config, path ) {

		path = path || [];

		_.each( config, function methodHandler ( handler, method ) {

			if ( typeof handler === "function" ) {

				if ( app ) {

					app[method]( "/" + path.join( "/" ),
						me.ajaxHandler.bind( {
							handler: handler.bind( manager )
						} ) );

				}

				if ( io ) {

					me.routes.push( {
						method: method, path: "/" + path.join( "/" ),
						handler: handler.bind( manager )
					} );

				}

			} else {

				me.registerRoute( manager, filename, handler,
					path.concat( [( path.length % 2 ? ":" : "" ) + method] ) );

			}

		} );

	}

};
