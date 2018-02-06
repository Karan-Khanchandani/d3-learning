import * as d3 from 'd3';

const width = 960;
const height = 480;

let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let plotMargins = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 30
};

let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${plotMargins.left}, ${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;

let xScale = d3.scaleTime()
    .range([0, plotWidth]);
let xAxis = d3.axisBottom(xScale);

let xAxisGroup = plotGroup.append('g')
    .classed('x', true)
    .classed('axis', true)
    .attr('transform', `translate(${0}, ${plotHeight})`)
    .call(xAxis);

let yScale = d3.scaleLinear()
    .range([plotHeight, 0]);
let yAxis = d3.axisLeft(yScale);
let yAxisGroup = plotGroup.append('g')
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);

let pointsGroup = plotGroup.append('g')
    .classed('points', true);


d3.json('https://api.reddit.com', (error, data) => {
    if (error) {
        console.log(error);
    }
    if (data) {
        console.log(data);
    }
});

let prepared = data.data.children.map(d => {
    return {
        date: new Date(d.data.created * 1000),
        score: d.data.score
    }
});
console.log(prepared);

xScale.domain(d3.extent(prepared, d => d.date))
    .nice();
xAxisGroup.call(xAxis);

yScale.domain(d3.extent(prepared, d => d.score))
    .nice();
yAxisGroup.call(yAxis);

var dataBound = pointsGroup.selectAll('.post')
    .data(prepared);

dataBound.exit()
    .remove();

var enterSelection = dataBound.enter()
    .append('g')
    .classed('post', true);

enterSelection.merge(dataBound)
    .attr('transform', (d, i) => `translate(${xScale(d.date)},${yScale(d.score)})`);


enterSelection.append('circle')
    .attr('r', 2)
    .style('fill', 'red');