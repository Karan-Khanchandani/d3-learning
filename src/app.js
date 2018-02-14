import * as d3 from 'd3';

var margin = {
        top: 80,
        bottom: 80,
        right: 80,
        left: 80
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parse = d3.timeFormat("%b %Y").parse;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var valueline = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.close));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transfomr", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("sample.csv", (err, data) => {
    if (err)
        throw err;

    data.forEach(function (d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
    });

    x.domain(d3.extent(data, d => d.date));
    y.domain(0, d3.max(data, d => d.close));

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%Y-%m-%d")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
});