import * as d3 from 'd3';

var margin = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 40
},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var y = d3.scaleLinear()
    .range([height, 0]);

var x = d3.scaleBand()
    .domain(["A", "B", "C", "D", "E", "F"])
    .rangeRound([0, width])
    .padding(0.1);




var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10, "%");


d3.tsv("/data/sample.tsv", type, function (error, data) {
    x.domain(data.map(function (d) {
        return d.name;
    }))
    y.domain([0, d3.max(data, function (d) {
        return d.value;
    })]);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    var barWidth = width / data.length;

    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(" + x(d.name) + ",0)";
        });

    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.name);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr("width", x.bandwidth());
});

function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}