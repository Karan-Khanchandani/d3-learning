import * as d3 from 'd3';

var margin = {
        top: 80,
        bottom: 80,
        right: 80,
        left: 80
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parse = d3.timeParse("%b %Y");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom().scale(x).tickSize(-height);
var yAxis = d3.axisRight().scale(y).ticks(4);

var area = d3.area()
    .curve(d3.curveCatmullRom)
    .x(d => x(d.date))
    .y0(height)
    .y1(d => y(d.price));


var line = d3.line()
    .curve(d3.curveCatmullRom)
    .x(d => x(d.date))
    .y(d => y(d.price));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/sample.csv", type, (err, data) => {
    if (err)
        throw err;

    var values = data.filter(d => d.symbol == "AMZN");
   
    var msft = data.filter(d => d.symbol == "MSFT");

    var ibm = data.filter(d => d.symbol == "IBM");

    console.log(values, msft, ibm);

    x.domain([values[0].date, values[values.length - 1].date]);
    y.domain([0, d3.max(values, d => d.price)]).nice();

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ", 0)")
        .call(yAxis);

    var colors = d3.scaleOrdinal(d3.schemeCategory10);
    svg.selectAll(".line")
        .data([values, msft, ibm])
        .enter()
        .append('path')
        .attr('class', "line")
        .style("stroke", d => colors(Math.random() * 50))
        .attr('clip-path', 'url(#clip)')
        .attr('d', function(d) {
            return line(d);
          })

    var curtain = svg.append("rect")
        .attr("x", -1 * width)
        .attr("y", -1 * height)
        .attr("width", width)
        .attr("height", height)
        .attr("class", "curtain")
        .attr("transform", "rotate(180)")
        .style("fill", '#ffffff')

    var guideline = svg.append("line")
        .attr("stroke", "#333")
        .attr("class", "guide")
        .attr("stroke-width", 0)
        .attr('x1', 1)
    .attr("y1", 1)
        .attr("x2", 1)
        .attr("y2", height);

    var t = svg.transition()
        .delay(750)
        .duration(6000)
        .ease(d3.easeLinear)
        .on('end', function() {
            d3.select("line.guide")
                .transition()
                .style('opacity', 0)
                .remove()
        })

    t.select('rect.curtain')
        .attr('width', 0);
    t.select('line.guide')
        .attr("transform", "translate(" + width + ", 0)")

    d3.select("#show_guideline").on("change", function (e) {
        guideline.attr('stroke-width', this.checked ? 1 : 0);
        curtain.attr("opacity", this.checked ? 0.75 : 1);
    })


});

function type(d) {
   
    d.date = parse(d.date);
   
    d.price = +d.price;
    return d;
}