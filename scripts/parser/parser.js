define(['util'], function(util) {
    'use strict';

	var Parser = function () {
	}

	Parser.prototype.parse = function () {
		console.log('Error: Pure virtual parse called!');
		return {};
	}

	Parser.prototype.prepare = function (input) {
		var i;
		input = input.split('\n');

		util.forEach(input, function (line, l) {
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

		i = 0;
		while (i < input.length) {
			if (input[i].length == 0) {
				input.splice(i, 1);
			} else {
				++i;
			}
		}

		console.log(input);

		return input;
	}

	return Parser;
});
