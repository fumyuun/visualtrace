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
				token = 0;
			if (tokens[token] == 'traceroute' || tokens[token] == 'traceroute:') {
				// Diagnostics, ignore
			} else {
				// Either next hop line or alternative route to same hop
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
				for (; token < tokens.length; token+=2) {
					if (tokens[token] != '*') {
						node.latencies.push(parseFloat(tokens[token]));
					}
				}
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
