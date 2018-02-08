import * as d3 from 'd3';

const margin = {
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


d3.tsv("/data/sample.tsv", type,  (error, data) => {
    x.domain(data.map (d => d.name))
    y.domain([0, d3.max(data,  d => d.value)]);

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
        .attr("transform",  (d, i) => "translate(" + x(d.name) + ",0)");

    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x",  d => 
             x(d.name)
        )
        .attr("y",  d => y(d.value)
        )
        .attr("height",  d => height - y(d.value) )
        .attr("width", x.bandwidth());
});

function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}