import { Checker } from "./D3ValueChecker";
import { ChartCreator, AxisType } from "./svg1";
// import * as d3 from "d3";
import * as d3Slt from "d3-selection";
import * as d3Clt from "d3-collection";
import * as d3Sca from "d3-scale";
import * as d3Arr from "d3-array";
import * as d3Ax from "d3-axis";
import * as d3Ft from "d3-fetch";

import "./svg2"

interface IData {
    name: string,
    sex: string,
    value: number
}


var svg1 = d3Slt.select('div#chart1 svg');
var svg2 = d3Slt.select('div#chart2 svg');

function show_bars(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    data: IData[], key_func: (d) => any, value_func: (d) => any, width: number = 800) {
    var namekeys = d3Clt.set(data, key_func).values();
    var height = namekeys.length * 40;
    svg.attr('height', height);
    var xscale = d3Sca.scaleLinear()
        .domain([0, d3Arr.max(data, value_func)])
        .range([0, width]);
    var yscale = d3Sca.scaleBand()
        .rangeRound([0, height])
        // .padding(0.3)
        .domain(namekeys);
    var xAxis = d3Ax.axisBottom(xscale);
    var yAxis = d3Ax.axisLeft(yscale);

    var texts = svg.selectAll('text')
        .data(data, key_func);
    var bars = svg.selectAll('rect')
        .data(data, key_func);
    bars.enter()
        .append('rect')
        .attr('fill', 'red')
        .attr('x', 0)
        .attr('y', d => yscale(key_func(d)))
        .attr('height', yscale.bandwidth() - 5)
        .attr('width', d => xscale(value_func(d)))
        .on('click', function () {
            console.log(this);
        })


    texts.enter()
        .append('text')
        .text(value_func)
        .attr('font-size', 20)
        .attr('x', d => xscale(value_func(d)))
        .attr('y', d => yscale(key_func(d)) + 20);

    svg.append('g')
        .attr('transform', `translate(${0},${0})`)
        .attr('class', 'yAxis')
        .call(yAxis);
    svg.append('g')
        .attr('transform', `translate(${0},${height})`)
        // .attr('transform', `translate(${tran.matrix.e},${tran.matrix.f})`)
        .attr('class', 'xAxis')
        .call(xAxis);
}

function show_bars_new(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    data: IData[],
    key_func: (d: IData) => string,
    value_func: (d: IData) => number,

) {

    var height = d3Clt.set(data, key_func).values().length * 40;
    var width = 500
    svg.attr('height', height);
    var cc = new ChartCreator(svg, height, width)

    
    var xscale = cc.createScaleLinear(AxisType.X, data, value_func)
    var yscale = cc.createScaleBand(AxisType.Y, data, key_func)


    var texts = svg.selectAll('text')
        .data(data, key_func);
    var bars = svg.selectAll('rect')
        .data(data, key_func);

    console.log(yscale.bandwidth())

    var barWidth=25
    var yoffset = yscale.bandwidth()/2 - barWidth + barWidth/2

    bars.enter()
        .append('rect')
        .attr('fill', 'red')
        .attr('x', 0)
        .attr('y', d => cc.setCenterBar(yscale.bandwidth(),barWidth,yscale(key_func(d))) )
        .attr('height', barWidth)
        .attr('width', d => xscale(value_func(d)))
        .on('click', function () {
            console.log(this);
        })


    texts.enter()
        .append('text')
        .text(value_func)
        .attr('font-size', 15)
        .attr('dominant-baseline','middle')
        .attr('x', d => xscale(value_func(d)))
        .attr('y', d => yscale(key_func(d))+yoffset + barWidth/2 )
        // .setCenterText()


    cc.createAxisElement(AxisType.X, d3Ax.axisBottom(xscale))
    cc.createAxisElement(AxisType.Y, d3Ax.axisLeft(yscale))

}



(async () => {


    var data = await d3Ft.csv('data.csv');





    var data1 = d3Clt.nest()
        .key(d => d.name)
        .rollup(d => d3Arr.sum(d, d => d.value))
        .entries(data);

    show_bars_new(svg1, data1, d => d.key, d => d.value);

    var data2 = d3Clt.nest()
        .key(d => d.sex)
        .rollup(d => d3Arr.sum(d, d => d.value))
        .entries(data);
    show_bars_new(svg2, data2, d => d.key, d => d.value);
})();



