define(['parser/parser', 'util'], function(Parser, util) {
    'use strict';

	var WindowsParser = util.createClass(Parser, function () {
		this.data = {};
	});

	return WindowsParser;
});
