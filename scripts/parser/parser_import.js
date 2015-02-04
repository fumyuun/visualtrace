define(['parser/parser', 'util'], function(Parser, util) {
    'use strict';

	var ImportParser = util.createClass(Parser, function () {
		this.data = {};
	});

	ImportParser.prototype.parse = function (input) {
		return JSON.parse(input);
	}


	return ImportParser;
});
