require(['parser/parser', 'parser/parser_osx'], function(Parser, OsxParser) {
	'use strict'

	var p, inputField, parseButton;

	inputField = document.getElementById('parseInput');
	parseButton = document.getElementById('parseButton');

	p = new OsxParser('foo');

	parseButton.onclick = function () {
		p.parse(inputField.value);
	}
});
