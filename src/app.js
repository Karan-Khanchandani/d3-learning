import * as d3 from 'd3';

const margin = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 30
},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// var y = d3.scaleLinear()
//     .range([height, 0]);

// var x = d3.scaleBand()
//     .rangeRound([0, width])
//     .padding(0.1);
var x = d3.scaleLinear()
.range([0, width]);

var y = d3.scaleBand()
.rangeRound([0,height])
.padding(0.2);



var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y)
    .tickSize(0)
    .tickPadding(6);


d3.tsv("/data/sample.tsv", type,  (error, data) => {
    x.domain(d3.extent(data, d => d.value)).nice();
    y.domain(data.map(d => d.name));

    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", d => {
            console.log(d.value);
            return "bar bar--" + (d.value < 0 ? "negative":"positive");
        })
        .attr("x",  d => x(Math.min(0, d.value))
        )
        .attr("y",  d => 
             y(d.name)
        )    
        .attr("height", y.bandwidth() )
        .attr("width", d => Math.abs(x(d.value) - x(0)));

        chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ", 0)")
        .call(yAxis);
});

function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}