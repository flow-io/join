'use strict';

var splitStream = require( 'flow-split' ),
	joinStream = require( './../lib' );

// Create a new split stream for tab delimited data:
var split = splitStream({
	'sep': /\t/
});

// Create a stream to make newline delimited data:
var join = joinStream({
	'sep': '\n'
});

// Create a stream pipeline:
split
	.pipe( join )
	.pipe( process.stdout );

// Write values to the split stream...
for ( var i = 0; i < 10; i++ ) {
	split.write( i+'\t', 'utf8'  );
}
split.end();
