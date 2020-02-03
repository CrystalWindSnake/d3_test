(async () => {

    var width = 500
    var height = 500
    var y_width = 60
    var bar_width = 50

    var svg = d3.select('svg')
        .attr('width', width + 50)
        .attr('height', height + 50)

    var data = await d3.csv('data.csv')
    var gp = d3.nest()
        .key(d => d.sex)
        .entries(data)

    console.log(Array(gp.keys()))

    gp.forEach(d => {
        console.log(d)
    })


    var namekeys = d3.set(data, d => d.name).values()



    var xColor = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(namekeys)


    var xScale = d3.scaleBand()
        .rangeRound([0, width])
        // .paddingInner(0.5)
        // .padding(1)
        .domain(namekeys)


    var xAxis = d3.axisBottom(xScale)

    var yScale = d3.scaleLinear()
        .domain([0, 1000])
        .range([height, 0])

    var yAxis = d3.axisLeft(yScale)

    svg.append('g')
        .attr('transform', `translate(${y_width},${height})`)
        .call(xAxis)

    svg.append('g')
        .attr('transform', `translate(${y_width},${0})`)
        .call(yAxis)


    function show(data) {
        var bars = svg.selectAll('rect')
            .data(data, d => d.name);

        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.name) + y_width)
            .attr('fill', d => xColor(d.sex))
            .attr('y', d => yScale(d.value))
            .attr('width', bar_width)
            .attr('height', d => yScale(0) - yScale(d.value))


        bars.transition().duration(1000)
            .attr('y', d => yScale(d.value))
            .attr('height', d => yScale(0) - yScale(d.value))

        bars.exit().remove();
    }

    setTimeout(function () {
        show(data);
    }, 0);

    // setTimeout(function () {
    //     show(data.filter(d => d.sex == 'f'));
    // }, 1000);
})()
