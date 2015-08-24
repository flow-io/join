'use strict';

// MODULES //

var Transform = require( 'readable-stream' ).Transform,
	copy = require( 'utils-copy' ),
	validate = require( './validate.js' );


// VARIABLES //

var DEFAULTS = require( './defaults.json' );


// STREAM //

/**
* FUNCTION: Stream( [options] )
*	Transform stream constructor.
*
* @constructor
* @param {Object} [options] - stream options
* @param {String} [options.sep=\n] - separator used to join streamed data
* @param {Boolean} [options.objectMode=false] - specifies whether stream should operate in object mode
* @param {String|Null} [options.encoding=null] - specifies how Buffer objects should be decoded to `strings`
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @param {Boolean} [options.allowHalfOpen=false] - specifies whether the stream should remain open even if one side ends
* @param {Boolean} [options.readableObjectMode=false] - specifies whether the readable side should be in object mode
* @returns {Stream} Transform stream
*/
function Stream( options ) {
	var opts,
		err;

	if ( !( this instanceof Stream ) ) {
		if ( arguments.length ) {
			return new Stream( options );
		}
		return new Stream();
	}
	opts = copy( DEFAULTS );
	if ( arguments.length ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	// The stream's writable state should always be in object mode to prevent incoming data from being buffered (concatenated) and thus lose separation...
	opts.writableObjectMode = true;

	// The stream converts each chunk into a string so no need to decode written strings as Buffer objects:
	opts.decodeStrings = false;

	// Make the stream a Transform stream:
	Transform.call( this, opts );

	// Destroy state:
	this._destroyed = false;

	// Cache the encoding...
	this._encoding = ( opts.encoding === null ) ? 'utf8' : opts.encoding;

	// Cache the separator...
	if ( this._encoding === 'utf8' ) {
		this._sep = opts.sep;
	} else {
		this._sep = new Buffer( opts.sep, this._encoding );
	}
	// Flag indicating if the stream has received streamed data:
	this._init = false;

	return this;
} // end FUNCTION Stream()

/**
* Create a prototype which inherits from the parent prototype.
*/
Stream.prototype = Object.create( Transform.prototype );

/**
* Set the constructor.
*/
Stream.prototype.constructor = Stream;

/**
* METHOD: _transform( chunk, encoding, clbk )
*	Implements the `_transform` method.
*
* @private
* @param {Buffer|String} chunk - streamed chunk
* @param {String} encoding - Buffer encoding
* @param {Function} clbk - callback to invoke after transforming the streamed chunk
*/
Stream.prototype._transform = function _transform( chunk, encoding, clbk ) {
	var len;
	if ( this._encoding === 'utf8' ) {
		if ( this._init ) {
			chunk = this._sep + chunk;
		} else {
			this._init = true;
		}
	} else {
		if ( this._init ) {
			chunk = new Buffer( chunk, encoding );
			len = this._sep.length + chunk.length;
			chunk = Buffer.concat( [ this._sep, chunk ], len );
			chunk = chunk.toString( this._encoding );
		} else {
			this._init = true;
		}
	}
	this.push( chunk, this._encoding );
	clbk();
}; // end METHOD _transform()

/**
* METHOD: destroy( [error] )
*	Gracefully destroys a stream, providing backwards compatibility.
*
* @param {Object} [error] - optional error message
* @returns {Stream} Stream instance
*/
Stream.prototype.destroy = function destroy( error ) {
	if ( this._destroyed ) {
		return;
	}
	var self = this;
	this._destroyed = true;
	process.nextTick( close );

	return this;

	/**
	* FUNCTION: close()
	*	Emits a `close` event.
	*
	* @private
	*/
	function close() {
		if ( error ) {
			self.emit( 'error', error );
		}
		self.emit( 'close' );
	}
}; // end METHOD destroy()


// EXPORTS //

module.exports = Stream;
