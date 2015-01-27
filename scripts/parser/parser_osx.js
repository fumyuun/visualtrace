define(['parser/parser', 'util'], function(Parser, util) {
    'use strict';

	var OsxParser = util.createClass(Parser, function () {
	});

	OsxParser.prototype.parse = function (input) {
		this.prepare(input);

		return {};
	}


	return OsxParser;
});
