require(['util', 'parser/parser', 'parser/parser_osx', 'graph', 'graphUtil'], function(util, Parser, OsxParser, graphViewer, graphUtil) {
	'use strict'

	var p, inputField, parseButton, localCounter, clearButton, graph;

	localCounter = document.getElementById('localCounter');
	inputField = document.getElementById('parseInput');
	parseButton = document.getElementById('parseButton');
	clearButton = document.getElementById('clearButton');

	p = new OsxParser('foo');

	if (localStorage['graph']) {
		graph = JSON.parse(localStorage['graph']);
		localCounter.innerText = graph.graphs;
		graphViewer.view(graph);
	}

	parseButton.onclick = function () {
		var graph = p.parse(inputField.value),
			local;

		if (localStorage['graph']) {
			graph = graphUtil.merge(JSON.parse(localStorage['graph']), graph);
		}
		localStorage['graph'] = JSON.stringify(graph);

		graphViewer.view(graph);
	}

	clearButton.onclick = function () {
		localStorage.removeItem('graph');
	}
});
