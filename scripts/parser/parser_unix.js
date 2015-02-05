define(['parser/parser', 'util'], function(Parser, util) {
    'use strict';

	var UnixParser = util.createClass(Parser, function () {
		this.data = {};
	});

	UnixParser.prototype.parse = function (input) {
		var hop = 0,
			me = this;

		input = this.prepare(input);

		this.data.nodes = [];
		this.data.links = [];
		this.data.graphs = 1;

		util.forEach(input, function (tokens) {
			var node = {},
				token = 0,
				parseNextNode = function () {
					node = {};
					if (parseInt(tokens[token]) == hop + 1) {
						hop++;
						token++;
					}
					node.group = 0;
					node.depth = hop;
					node.hostname = tokens[token++];
					node.ip = tokens[token++];
					node.name = node.hostname + node.ip;
					node.latencies = [];
					for (; token < tokens.length; token++) {
						if (tokens[token] != '*' && tokens[token] != 'ms') {
							if (isNaN(parseFloat(tokens[token]))) {
								// Problematic line where pings to same host respond with different
								// names. Restart parsing on the same line.
								me.data.nodes.push(node);
								parseNextNode();
								return;
							}
							node.latencies.push(parseFloat(tokens[token]));
						}
					}

				};
			if (tokens[token] == 'traceroute' || tokens[token] == 'traceroute:') {
				// Diagnostics, ignore
			} else {
				// Either next hop line or alternative route to same hop
				parseNextNode();
				me.data.nodes.push(node);
			}
		});

		util.forEach(this.data.nodes, function (dest, i) {
			if (dest.depth > 1) {
				util.forEach(me.data.nodes, function (src, j) {
					if (src.depth == dest.depth - 1) {
						me.data.links.push({source: parseInt(j), target: parseInt(i)});
						return;
					}
				});
			}
		});

		return this.data;
	}


	return UnixParser;
});
