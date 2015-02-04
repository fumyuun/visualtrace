define(['util'], function(util) {
    'use strict';

    var graph = {};

    graph.merge = function (a, b) {
        util.forEach(b.nodes, function (node) {
            node.group = a.graphs;
        });
        util.forEach(b.links, function (link) {
            link.source += a.nodes.length;
            link.target += a.nodes.length;
        });

        return {graphs: a.graphs + 1, nodes: a.nodes.concat(b.nodes), links: a.links.concat(b.links)};
    };

    return graph;
});