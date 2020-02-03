var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => __awaiter(this, void 0, void 0, function* () {
    var width = 500;
    var height = 500;
    var y_width = 60;
    var bar_width = 50;
    var svg = d3.select('svg')
        .attr('width', width + 50)
        .attr('height', height + 50);
    var data = yield d3.csv('data.csv');
    var namekeys = d3.set(data, d => d.name).values();
    var xColor = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3.set(data, d => d.sex).values());
    var xScale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.5)
        .domain(namekeys);
    var xAxis = d3.axisBottom(xScale);
    var yScale = d3.scaleLinear()
        .domain([0, 1000])
        .range([height, 0]);
    var yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('transform', `translate(${y_width},${height})`)
        .call(xAxis);
    svg.append('g')
        .attr('transform', `translate(${y_width},${0})`)
        .call(yAxis);
    function show(data) {
        var bars = svg.selectAll('rect')
            .data(data, d => d.name);
        var texts = svg.selectAll('text')
            .data(data, d => d.name);
        bars.enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.name) + y_width)
            .attr('fill', d => xColor(d.sex))
            .attr('y', d => yScale(d.value))
            .attr('width', bar_width)
            .attr('height', d => yScale(0) - yScale(d.value));
        texts.enter()
            .append('text')
            .text(d => d.name)
            .attr('font-size', 55)
            .attr('x', d => xScale(d.name) + y_width)
            .attr('y', d => yScale(d.value));
        bars.attr('fill', 'red')
            .transition().duration(1000)
            .attr('y', d => yScale(d.value))
            .attr('height', d => yScale(0) - yScale(d.value));
        texts.exit().remove();
        bars.exit()
            .each(d => console.log(d))
            .attr('fill', 'black')
            .transition().duration(1000)
            .attr('y', yScale(0))
            .attr('height', 0)
            .remove();
    }
    setTimeout(function () {
        show(data);
    }, 0);
    setTimeout(function () {
        show(data.filter(d => d.sex == 'f'));
    }, 1000);
}))();
//# sourceMappingURL=test.js.map