/* eslint no-console: 0 */
"use strict";

var gulp = require( "gulp" ),
	browserify = require( "gulp-browserify" );

// Basic usage
gulp.task( "scripts", function scripts () {

	// Single entry point to browserify
	gulp.src( "src/lib/app.js" ).pipe(
		browserify( {
			insertGlobals: false,
			debug: true
		} )
	).pipe( gulp.dest( "./dist/js/" ) );

} );

gulp.task( "watch", function watchHandler () {

	gulp.watch( "src/lib/**/*.js", ["scripts"] ).
		on( "error", console.log.bind( console ) );

} );

gulp.task( "default", ["scripts"], function defaultHandler () {

	gulp.src( "src/index.html" ).
		pipe( gulp.dest( "./dist" ) );

	gulp.src( "src/external/*.js" ).
		pipe( gulp.dest( "./dist/js" ) );

} );
