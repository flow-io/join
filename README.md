Join
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Creates a [transform stream](https://nodejs.org/api/stream.html) which joins streamed data.


## Installation

``` bash
$ npm install flow-join
```


## Usage

``` javascript
var stream = require( 'flow-join' );
```

#### stream( [options] )

Creates a [transform stream](https://nodejs.org/api/stream.html) which joins streamed data.

``` javascript
var tStream = stream();

tStream.pipe( process.stdout );
tStream.write( '1' );
// => 1

tStream.write( '2' );
// => \n2

tStream.write( '3' );
// => \n3

tStream.end();
```

The function accepts the following `options`:

*	__sep__: separator used to join streamed data. Default: `'\n'`.
*	__objectMode__: `boolean` which specifies whether a [stream](https://nodejs.org/api/stream.html) should operate in object mode. Default: `false`.
* 	__encoding__: specifies how `Buffer` objects should be decoded to `strings`. Default: `null`.
*	__highWaterMark__: specifies the `Buffer` level at which `write()` calls start returning `false`. Default: `16` (16kb).
*	__allowHalfOpen__: specifies whether a [stream](https://nodejs.org/api/stream.html) should remain open even if one side ends. Default: `false`.
*	__readableObjectMode__: specifies whether the readable side should be in object mode. Default: `false`.

To set [stream](https://nodejs.org/api/stream.html) `options`,

``` javascript
var opts = {
	'sep': ',',
	'objectMode': true,
	'encoding': 'utf8',
	'highWaterMark': 64,
	'allowHalfOpen': true,
	'readableObjectMode': false // overridden by `objectMode` option when `objectMode=true`
};

var tStream = stream( opts );
```

#### stream.factory( [options] )

Creates a reusable [stream](https://nodejs.org/api/stream.html) factory. The factory method ensures [streams](https://nodejs.org/api/stream.html) are configured identically by using the same set of provided `options`.

``` javascript
var opts = {
	'sep': '\t',
	'objectMode': true,
	'encoding': 'utf8',
	'highWaterMark': 64	
};

var factory = stream.factory( opts );

// Create 10 identically configured streams...
var streams = [];
for ( var i = 0; i < 10; i++ ) {
	streams.push( factory() );
}
```


#### stream.objectMode( [options] )

This method is a convenience function to create [streams](https://nodejs.org/api/stream.html) which always operate in `objectMode`. The method will __always__ override the `objectMode` option in `options`.

``` javascript
var tStream = stream.objectMode({
	'sep': ','
});

tStream.pipe( process.stdout );
tStream.write( 'a' );
// => a

tStream.write( 'b' );
// => ,b

tStream.write( 'c' );
// => ,c

tStream.end();
```


## Examples

``` javascript
var splitStream = require( 'flow-split' ),
	joinStream = require( 'flow-join' );

// Create a split stream for tab delimited data:
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
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Flow.io](http://flow-io.com) Authors.


[npm-image]: http://img.shields.io/npm/v/flow-join.svg
[npm-url]: https://npmjs.org/package/flow-join

[travis-image]: http://img.shields.io/travis/flow-io/join/master.svg
[travis-url]: https://travis-ci.org/flow-io/join

[codecov-image]: https://img.shields.io/codecov/c/github/flow-io/join/master.svg
[codecov-url]: https://codecov.io/github/flow-io/join?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/join.svg
[dependencies-url]: https://david-dm.org/flow-io/join

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/join.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/join

[github-issues-image]: http://img.shields.io/github/issues/flow-io/join.svg
[github-issues-url]: https://github.com/flow-io/join/issues
