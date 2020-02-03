

var td=d3.selectAll('tbody tr td') //.selectAll('td')
td.style('color', function(d,i) {
    var x:Element=this
    
    console.log([x.textContent,i])
    return i ? null :'red'
})