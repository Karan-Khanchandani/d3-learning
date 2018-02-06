'use strict';

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var width = 960;
var height = 480;

var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

var plotMargins = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 30
};

var plotGroup = svg.append('g').classed('plot', true).attr('transform', 'translate(' + plotMargins.left + ', ' + plotMargins.top + ')');

var plotWidth = width - plotMargins.left - plotMargins.right;
var plotHeight = height - plotMargins.top - plotMargins.bottom;

var xScale = d3.scaleTime().range([0, plotWidth]);
var xAxis = d3.axisBottom(xScale);

var xAxisGroup = plotGroup.append('g').classed('x', true).classed('axis', true).attr('transform', 'translate(' + 0 + ', ' + plotHeight + ')').call(xAxis);

var yScale = d3.scaleLinear().range([plotHeight, 0]);
var yAxis = d3.axisLeft(yScale);
var yAxisGroup = plotGroup.append('g').classed('y', true).classed('axis', true).call(yAxis);

var pointsGroup = plotGroup.append('g').classed('points', true);

d3.json('https://api.reddit.com', function (error, data) {
    if (error) {
        console.log(error);
    }
    if (data) {
        console.log(data);
    }
});

var prepared = data.data.children.map(function (d) {
    return {
        date: new Date(d.data.created * 1000),
        score: d.data.score
    };
});
console.log(prepared);

xScale.domain(d3.extent(prepared, function (d) {
    return d.date;
})).nice();
xAxisGroup.call(xAxis);

yScale.domain(d3.extent(prepared, function (d) {
    return d.score;
})).nice();
yAxisGroup.call(yAxis);

var dataBound = pointsGroup.selectAll('.post').data(prepared);

dataBound.exit().remove();

var enterSelection = dataBound.enter().append('g').classed('post', true);

enterSelection.merge(dataBound).attr('transform', function (d, i) {
    return 'translate(' + xScale(d.date) + ',' + yScale(d.score) + ')';
});

enterSelection.append('circle').attr('r', 2).style('fill', 'red');
//# sourceMappingURL=index.js.map