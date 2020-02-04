var rows = [
    [100, 2, 3],
    [400, 5, 6]
] 
var svg=d3.select('svg#chart')
svg.selectAll('rect').data(rows)
    .enter()
    .append('rect')
    .attr('x',10)
    .attr('y',10)
    .attr('width',50)
    .attr('height',d=>d[0])

// var rows = [
//     [1, 2, 3],
//     [4, 5, 6]
// ]

// var test =d3.select('table tr')
//         .selectAll('td')
// console.log(test)




// var rows = [
//     [ 0,  1,  2,  3],
//     [ 4,  5,  6,  7],
//     [ 8,  9, 10, 11],
//     [12, 13, 14, 15],
//   ];




// var tr=d3.select('table tr')
//     // .data(rows)
//     // .selectAll('td')
//     // .data(d=>d)
//     // .enter()
//     // .append('td')
//     // .text(d=>d)

// console.log(tr)



