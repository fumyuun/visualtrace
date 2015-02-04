require(['util', 'parser/parser', 'parser/parser_unix', 'parser/parser_windows', 'parser/parser_import', 'graph', 'graphUtil'],
	function(util, Parser, UnixParser, WindowsParser, ImportParser, graphViewer, graphUtil) {
	'use strict'

	var p, inputField, parseButton, localCounter, clearButton, exportButton, parserSelector, graph,
		parsers = {};

	var setParser = function (parser) {
		p = parsers[parser];
	}

	localCounter = document.getElementById('localCounter');
	inputField = document.getElementById('parseInput');
	parseButton = document.getElementById('parseButton');
	clearButton = document.getElementById('clearButton');
	exportButton = document.getElementById('exportButton');
	parserSelector = document.getElementById('parserSelector');

	parsers['unix'] = new UnixParser('foo');
	parsers['windows'] = new WindowsParser('foo');
	parsers['import'] = new ImportParser('foo');

	setParser(parserSelector.value);

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

	exportButton.onclick = function () {
		inputField.value = localStorage['graph'];
	}

	parserSelector.onchange = function () {
		setParser(parserSelector.value);
	}
});
