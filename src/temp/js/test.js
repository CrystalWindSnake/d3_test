"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const svg1_1 = require("./svg1");
const d3Slt = require("d3-selection");
const d3Clt = require("d3-collection");
const d3Sca = require("d3-scale");
const d3Arr = require("d3-array");
const d3Ax = require("d3-axis");
const d3Ft = require("d3-fetch");
require("./svg2");
var svg1 = d3Slt.select('div#chart1 svg');
var svg2 = d3Slt.select('div#chart2 svg');
function show_bars(svg, data, key_func, value_func, width = 800) {
    var namekeys = d3Clt.set(data, key_func).values();
    var height = namekeys.length * 40;
    svg.attr('height', height);
    var xscale = d3Sca.scaleLinear()
        .domain([0, d3Arr.max(data, value_func)])
        .range([0, width]);
    var yscale = d3Sca.scaleBand()
        .rangeRound([0, height])
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
    });
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
        .attr('class', 'xAxis')
        .call(xAxis);
}
function show_bars_new(svg, data, key_func, value_func) {
    var height = d3Clt.set(data, key_func).values().length * 40;
    var width = 500;
    svg.attr('height', height);
    var cc = new svg1_1.ChartCreator(svg, height, width);
    var xscale = cc.createScaleLinear(svg1_1.AxisType.X, data, value_func);
    var yscale = cc.createScaleBand(svg1_1.AxisType.Y, data, key_func);
    var texts = svg.selectAll('text')
        .data(data, key_func);
    var bars = svg.selectAll('rect')
        .data(data, key_func);
    console.log(yscale.bandwidth());
    var barWidth = 25;
    var yoffset = yscale.bandwidth() / 2 - barWidth + barWidth / 2;
    bars.enter()
        .append('rect')
        .attr('fill', 'red')
        .attr('x', 0)
        .attr('y', d => cc.setCenterBar(yscale.bandwidth(), barWidth, yscale(key_func(d))))
        .attr('height', barWidth)
        .attr('width', d => xscale(value_func(d)))
        .on('click', function () {
        console.log(this);
    });
    texts.enter()
        .append('text')
        .text(value_func)
        .attr('font-size', 15)
        .attr('dominant-baseline', 'middle')
        .attr('x', d => xscale(value_func(d)))
        .attr('y', d => yscale(key_func(d)) + yoffset + barWidth / 2);
    cc.createAxisElement(svg1_1.AxisType.X, d3Ax.axisBottom(xscale));
    cc.createAxisElement(svg1_1.AxisType.Y, d3Ax.axisLeft(yscale));
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    var data = yield d3Ft.csv('data.csv');
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
}))();
//# sourceMappingURL=test.js.map