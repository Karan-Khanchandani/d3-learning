import * as d3 from 'd3';

d3.select('#root')
.append('h4')
.append('text')
.text(`D3 Version: ${d3.version}`);
