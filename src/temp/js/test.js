var td = d3.selectAll('tbody tr td');
td.style('color', function (d, i) {
    var x = this;
    console.log([x.textContent, i]);
    return i ? null : 'red';
});
//# sourceMappingURL=test.js.map