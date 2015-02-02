require(['parser/parser', 'parser/parser_osx', 'graph'], function(Parser, OsxParser, graphViewer) {
	'use strict'

	var p, inputField, parseButton;

	inputField = document.getElementById('parseInput');
	parseButton = document.getElementById('parseButton');

	p = new OsxParser('foo');

	parseButton.onclick = function () {
		var graph = p.parse(inputField.value);
		console.log(graph);
		graphViewer.view(graph);
	}
});
