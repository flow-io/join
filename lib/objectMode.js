'use strict';

// MODULES //

var Stream = require( './stream.js' );


// OBJECT MODE //

/**
* FUNCTION: objectMode( [options] )
*	Returns a stream with `objectMode` set to `true`.
*
* @param {Object} [options] - stream options
* @param {String} [options.sep=\n] - separator used to join streamed data
* @param {Boolean} [options.objectMode=false] - specifies whether stream should operate in object mode
* @param {String|Null} [options.encoding=null] - specifies how Buffer objects should be decoded to `strings`
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @param {Boolean} [options.allowHalfOpen=false] - specifies whether the stream should remain open even if one side ends
* @param {Boolean} [options.readableObjectMode=false] - specifies whether the readable side should be in object mode
* @returns {Stream} Transform stream
*/
function objectMode( options ) {
	var opts;
	if ( arguments.length ) {
		opts = options;
	} else {
		opts = {};
	}
	opts.objectMode = true;
	return new Stream( opts );
} // end FUNCTION objectMode()


// EXPORTS //

module.exports = objectMode;
