require(['parser/parser'], function(Parser) {
	'use strict'

	var p, inputField, parseButton;

	inputField = document.getElementById('parseInput');
	parseButton = document.getElementById('parseButton');

	p = new Parser('foo');

	parseButton.onclick = function () {
		p.parse(inputField.value);
	}
});
