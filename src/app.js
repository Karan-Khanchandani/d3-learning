import * as d3 from 'd3';

d3.csv('/data/sample.csv', (error, dataset) => {
    dataset.forEach((data) => {
      console.log(data)
    })
  })
  