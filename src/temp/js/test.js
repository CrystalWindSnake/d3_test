var rows = [
    [100, 2, 3],
    [400, 5, 6]
];
var svg = d3.select('svg#chart');
svg.selectAll('rect').data(rows)
    .enter()
    .append('rect')
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 50)
    .attr('height', d => d[0]);
//# sourceMappingURL=test.js.map