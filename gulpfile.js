/* eslint no-console: 0 */
"use strict";

var gulp = require( "gulp" ),
	browserify = require( "gulp-browserify" );

// Basic usage
gulp.task( "scripts", function scripts () {

	// Single entry point to browserify
	var processing = gulp.src(
		"src/lib/app.js"
	).pipe(
		browserify( {
			insertGlobals: false,
			debug: true
		} )
	).on(
		"error",
		function handleError ( err ) {

			console.error( err.toString() );
			processing.emit( "end" );

		}
	).pipe(
		gulp.dest( "./dist/js/" )
	);

} );

gulp.task( "watch", function watchHandler () {

	gulp.watch( "src/lib/**/*.js", ["scripts"] );

} );

gulp.task( "default", ["scripts"], function defaultHandler () {

	gulp.src( "src/index.html" ).
		pipe( gulp.dest( "./dist" ) );

	gulp.src( "src/external/*.js" ).
		pipe( gulp.dest( "./dist/js" ) );

} );
