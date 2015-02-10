define(['util'], function(util) {
    'use strict';

    var graph = {};

    /**
     * In a given link list, replace every instance of 'from' with 'to'
     */
    var swapLinks = function (links, from, to) {
        util.forEach(links, function (link) {
            if (link.source == from) {
                link.source = to;
            } if (link.target == from) {
                link.target = to;
            }
        });
    }

    /**
     * Lower all links pointing to a given index from or higher with one
     */
    var lowerNextLinks = function (links, from) {
        util.forEach(links, function (link) {
            if (link.source >= from) {
                link.source--;
            }
            if (link.target >= from) {
                link.target--;
            }
        });
    }

    /**
     * Merge latencies from node j to i
     */
    var fixLatencies = function (g, i, j) {
        var minmax;
        g.nodes[i].latencies = g.nodes[i].latencies.concat(g.nodes[j].latencies);
        minmax = util.minmax(g.nodes[i].latencies);
        g.nodes[i].minLatency = minmax.min;
        g.nodes[i].maxLatency = minmax.max;
        g.nodes[i].avgLatency = util.avarage(g.nodes[i].latencies);
    }

    /**
     * Merge all duplicate non-erroring or LAN nodes into superstates
     */
    var removeDups = function (g) {
        var i, j;
        i = 0;
        while (i < g.nodes.length) {
            if (g.nodes[i].hostname == '*' || g.nodes[i].ip.indexOf('192.168.') != -1) {
                // Don't merge erroring or LAN nodes
            } else {
                j = i + 1;
                while (j < g.nodes.length) {
                    if (g.nodes[i].hostname == g.nodes[j].hostname) {
                        fixLatencies(g, i, j);

                        g.nodes.splice(j, 1);           // remove j
                        swapLinks(g.links, j, i);       // replace all links to/from j with i
                        lowerNextLinks(g.links, j);     // lower all links higher than j with 1
                    } else {
                        j++;
                    }
                }
            }
            i++;
        }
        return g;
    }


    /**
     * Add graph b to graph a
     */
    graph.merge = function (a, b) {
        var superGraph;
        util.forEach(b.nodes, function (node) {
            node.group = a.graphs;
        });
        util.forEach(b.links, function (link) {
            link.source += a.nodes.length;
            link.target += a.nodes.length;
        });

        superGraph = {graphs: a.graphs + 1, nodes: a.nodes.concat(b.nodes), links: a.links.concat(b.links)};
        removeDups(superGraph);

        return superGraph;
    };

    return graph;
});