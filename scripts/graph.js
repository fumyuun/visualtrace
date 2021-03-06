define(['util', 'd3.v3.min'], function(util, d3) {
    'use strict';

    // The following code is based on the example from:
    // http://bl.ocks.org/couchand/6420534

    var graph = {};

    var errorNode = function (d) {
        return d.hostname == '*';
    }

    var color = d3.scale.category10();
    var colorByGroup = function (d) {
        return errorNode(d) ? '#f00' : color(d.group);
    }

    var width = 2000,
        height = 2000;

    var svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var node, link;
    var tooltip = document.getElementById('tooltip');

    var voronoi = d3.geom.voronoi()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .clipExtent([[-10, -10], [width+10, height+10]]);

    var recenterVoronoi = function (nodes) {
        var shapes = [];
        voronoi(nodes).forEach(function (d) {
            if ( !d.length ) return;
            var n = [];
            d.forEach(function (c) {
                n.push([ c[0] - d.point.x, c[1] - d.point.y ]);
            });
            n.point = d.point;
            shapes.push(n);
        });
        return shapes;
    }

    var force = d3.layout.force()
        .charge(-5000)
        .friction(0.2)
        .linkDistance(30)
        .size([width, height]);

    force.on('tick', function() {
        node.attr('transform', function (d) { return 'translate('+d.x+','+d.y+')'; })
            //.attr('clip-path', function(d) { return 'url(#clip-'+d.index+')'; });

        link.attr('x1', function (d) { return d.source.x; })
            .attr('y1', function (d) { return d.source.y; })
            .attr('x2', function (d) { return d.target.x; })
            .attr('y2', function (d) { return d.target.y; });

        var clip = svg.selectAll('.clip')
            .data( recenterVoronoi(node.data()), function(d) { return d.point.index; } );

        clip.enter().append('clipPath')
            .attr('id', function(d) { return 'clip-'+d.point.index; })
            .attr('class', 'clip');
        clip.exit().remove()

        clip.selectAll('path').remove();
        clip.append('path')
            .attr('d', function(d) { return 'M'+d.join(',')+'Z'; });
    });

    graph.view = function(data) {
        svg.selectAll('*').remove();
        
        data.nodes.forEach(function (d, i) {
            d.id = i;
        });

         // build the arrow
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 3)
            .attr("markerHeight", 3)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        link = svg.selectAll('.link')
            .data( data.links )
            .enter().append('line')
            .attr('class', 'link')
            //.attr("marker-end", "url(#end)")  //add the marker!
            .style("stroke-width", function (d) { 
                var node = data.nodes[d.source];
                if (node.latencies.length > 0) {
                    return node.latencies[0];
                } else {
                    return 2;
                } 
            })
           .style("stroke", function (d) { 
                var node = data.nodes[d.source];
                // make latencyless links red
                if (node.latencies.length == 0) {
                    return "#f00";
                } else {
                    return "#999";
                } 
            })
            .on('mouseover', function (d) {
                // update tooltip on mouse over
                tooltip.innerText = 'Avg: ' + d.source.avgLatency
                    + ' (min: ' + d.source.minLatency
                    + ', max: ' + d.source.maxLatency + ')';

                tooltip.style.left = d3.mouse(this)[0] +'px';
                tooltip.style.top = (d3.mouse(this)[1] + 530) +'px';
            });

        // build the nodes
        node = svg.selectAll('.node')
            .data( data.nodes )
            .enter().append('g')
            .attr('title', name)
            .attr('class', 'node')
            .call( force.drag );

        // add the circles
        node.append('circle')
            .attr('r', function (d) { return errorNode(d) ? 20 : 10; })
            .attr('fill', colorByGroup)
            .attr('fill-opacity', function (d) {return errorNode(d) ? 1.0 : 0.5; })
            .append('title')
                .text(function(d) { return d.name; });

        node.append('circle')
            .attr('r', 4)
            .attr('stroke', 'black');

        // add the text 
        node.append("text")
            .attr("x", 5)
            .attr("dy", ".35em")
            .text(function(d) { return d.hostname; });


        force
            .nodes( data.nodes )
            .links( data.links )
            .start();


    };



    return graph;
});