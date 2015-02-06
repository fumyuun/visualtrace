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

    graph.swapLinks = function (links, from, to) {
        util.forEach(links, function (link) {
            if (link.source == from) {
                link.source = to;
            } if (link.target == from) {
                link.target = to;
            }
        });
    }

    graph.lowerNextLinks = function (links, from) {
        util.forEach(links, function (link) {
            if (link.source >= from) {
                link.source--;
            }
            if (link.target >= from) {
                link.target--;
            }
        });
    }

    graph.removeDups = function (g) {
        var i, j;
        i = 0;
        while (i < g.nodes.length) {
            j = i + 1;
            while (j < g.nodes.length) {
                if (g.nodes[i].hostname == g.nodes[j].hostname) {
                    g.nodes.splice(j, 1);
                    graph.swapLinks(g.links, j, i);
                    graph.lowerNextLinks(g.links, j);
                } else {
                    j++;
                }
            }
            i++;
        }
        return g;
    }

    return graph;
});