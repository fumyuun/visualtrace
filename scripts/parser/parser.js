define(['util'], function() {
    'use strict';

	var Parser = function () {
	}

	Parser.prototype.parse = function () {
		console.log('Error: Pure virtual parse called!');
		return {};
	}

	Parser.prototype.prepare = function (input) {
		input = input.split('\n');
		console.log(input);
	}

	return Parser;
});
