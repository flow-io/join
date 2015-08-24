/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	Transform = require( 'readable-stream' ).Transform,
	through2 = require( 'through2' ),
	Stream = require( './../lib/stream.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'Stream', function tests() {

	it( 'should export a function', function test() {
		expect( Stream ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		expect( foo ).to.throw( TypeError );
		function foo() {
			var s = new Stream({
				'objectMode': 'beep'
			});
		}
	});

	it( 'should return a Transform stream', function test() {
		var s = new Stream();
		assert.instanceOf( s, Transform );
	});

	it( 'should not require the `new` operator', function test() {
		var stream = Stream,
			s;

		s = stream();
		assert.instanceOf( s, Transform );

		s = stream({});
		assert.instanceOf( s, Transform );
	});

	it( 'should join streamed data', function test( done ) {
		var expected,
			cnt,
			s, t;

		s = new Stream();
		t = through2( onData );

		expected = ['1','\n2','\n3'];
		cnt = 0;

		s.pipe( t );
		s.write( '1' );
		s.write( '2' );
		s.write( '3' );
		s.end();

		function onData( chunk, enc, clbk ) {
			assert.strictEqual( chunk.toString(), expected[ cnt ] );
			clbk();

			cnt += 1;
			if ( cnt === expected.length ) {
				done();
			}
		}
	});

	it( 'should join streamed data in object mode', function test( done ) {
		var expected,
			cnt,
			s, t;

		s = new Stream({
			'objectMode': true,
			'sep': '--'
		});
		t = through2( onData );

		expected = ['1','--2','--3'];
		cnt = 0;

		s.pipe( t );
		s.write( '1' );
		s.write( '2' );
		s.write( '3' );
		s.end();

		function onData( chunk, enc, clbk ) {
			assert.strictEqual( chunk.toString(), expected[ cnt ] );
			clbk();

			cnt += 1;
			if ( cnt === expected.length ) {
				done();
			}
		}
	});

	it( 'should join streamed data not encoded as UTF-8', function test( done ) {
		var expected,
			cnt,
			d,
			s, t;

		s = new Stream({
			'encoding': 'base64',
			'sep': new Buffer( '|' ).toString( 'base64' )
		});
		t = through2( onData );

		expected = ['1','|2','|3'];
		cnt = 0;

		s.pipe( t );

		d = new Buffer( '1' );
		d = d.toString( 'base64' );
		s.write( d, 'base64' );

		d = new Buffer( '2' );
		d = d.toString( 'base64' );
		s.write( d, 'base64' );

		d = new Buffer( '3' );
		d = d.toString( 'base64' );
		s.write( d, 'base64' );

		s.end();

		function onData( chunk, enc, clbk ) {
			chunk = chunk.toString();
			chunk = new Buffer( chunk, 'base64' );
			chunk = chunk.toString();
			assert.strictEqual( chunk, expected[ cnt ] );
			clbk();

			cnt += 1;
			if ( cnt === expected.length ) {
				done();
			}
		}
	});

	it( 'should provide a method to destroy a stream', function test( done ) {
		var count = 0,
			s;

		s = new Stream();

		expect( s.destroy ).to.be.a( 'function' );

		s.on( 'error', onError );
		s.on( 'close', onClose );

		s.destroy( new Error() );

		function onError( err ) {
			count += 1;
			if ( err ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			if ( count === 2 ) {
				done();
			}
		}
		function onClose() {
			count += 1;
			assert.ok( true );
			if ( count === 2 ) {
				done();
			}
		}
	});

	it( 'should not allow a stream to be destroyed more than once', function test( done ) {
		var s;

		s = new Stream();

		s.on( 'error', onError );
		s.on( 'close', onClose );

		// If the stream is closed twice, the test will error...
		s.destroy();
		s.destroy();

		function onClose() {
			assert.ok( true );
			done();
		}
		function onError( err ) {
			assert.ok( false );
		}
	});

});
