define(['util'], function(util) {
    'use strict';

	var Parser = function () {
	}

	Parser.prototype.parse = function () {
		console.log('Error: Pure virtual parse called!');
		return {};
	}

	Parser.prototype.prepare = function (input) {
		input = input.split('\n');

		util.forEach(input, function (line, l) {
			var i;
			line = line.split(' ');
			i = 0;
			while(i < line.length) {
				if (line[i] == '') {
					line.splice(i, 1);
				} else {
					++i;
				}
			}
			input[l] = line;
		});

		return input;
	}

	return Parser;
});
