define(['parser/parser', 'util'], function(Parser, util) {
    'use strict';

	var OsxParser = util.createClass(Parser, function () {
		this.data = {};
	});

	OsxParser.prototype.parse = function (input) {
		var hop = 0,
			me = this;

		input = this.prepare(input);

		this.data.nodes = [];
		this.data.links = [];

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
				node.depth = hop;
				node.hostname = tokens[token++];
				node.ip = tokens[token++];
				node.latencies = [];
				for (; token < tokens.length; token+=2) {
					node.latencies.push(tokens[token]);
				}
				me.data.nodes.push(node);
				if (hop > 1) {
					me.data.links.push({source: (hop-1), target: hop});
					me.data.links.push({source: hop, target: (hop-1)});
				}
			}
		});

		console.log(this.data);

		return {};
	}


	return OsxParser;
});
