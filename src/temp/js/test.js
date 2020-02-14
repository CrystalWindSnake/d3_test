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
const d3 = require("d3");
require("./helper/d3Ex");
class Chart {
    constructor(svgSelector, height, width) {
        this.initRunned = false;
        this.svgSelector = svgSelector;
        this.height = height;
        this.width = width;
        this.svg = d3.select(svgSelector);
    }
    Excute(data) {
        if (!this.initRunned) {
            this.init(data);
            this.initRunned = true;
        }
        var xScale = this.createXScale(data);
        var yScale = this.createYScale(data);
        this.createMark(data, xScale, yScale);
        this.createXAxis(xScale);
        this.createYAxis(yScale);
    }
}
class Bar extends Chart {
    constructor(svgSelector, allnames, height, width) {
        super(svgSelector, height, width);
        this.isOnceRun = true;
        this.keyFunc = d => d.key;
        this.valueFunc = d => d.value;
        this.allnames = allnames;
    }
    finished() {
        this.isOnceRun = false;
    }
    init(data) {
        this.height = d3.set(data, this.keyFunc).values().length * 40;
        this.svg.attr('height', this.height);
    }
    createXScale(data) {
        if (this.isOnceRun) {
            var s = d3.scaleLinear()
                .domain([0, d3.max(data, this.valueFunc)])
                .range([0, this.width]);
            this.tempXScale = s;
        }
        return this.tempXScale;
    }
    createYScale(data) {
        if (this.isOnceRun) {
            var s = d3.scaleBand()
                .domain(this.allnames)
                .rangeRound([0, this.height]);
            this.tempYScale = s;
        }
        return this.tempYScale;
    }
    createMark(data, xScale, yScale) {
        var bars = this.svg.selectAll('rect')
            .data(data, this.keyFunc);
        var barHeight = 25;
        bars.enter()
            .append('rect')
            .attr('fill', 'red')
            .attr('height', barHeight)
            .attr('x', 0)
            .exCalCenterBar('y', yScale, barHeight, this.keyFunc)
            .merge(bars)
            .transition().duration(1000)
            .attr('width', d => xScale(d.value));
        bars.exit()
            .transition().duration(800)
            .attr('width', 0)
            .remove();
        var texts = this.svg.selectAll('text').data(data, this.keyFunc);
        texts.enter()
            .append('text')
            .attr('font-size', 15)
            .exSetCenterText(svg1_1.Direction.H, 'y', yScale, barHeight, this.keyFunc)
            .merge(texts)
            .transition().duration(1000)
            .tween('text', (d, i, gs) => {
            var real = d3.select(gs[i]);
            console.log(d, real.datum());
            var i = d3.interpolate(0, this.valueFunc(d));
            return function (t) {
                real.text(i(t).toFixed(0));
            };
        })
            .attr('x', d => xScale(d.value));
        texts.exit().remove();
    }
    createXAxis(scale) {
        if (this.isOnceRun) {
            var x = d3.axisBottom(scale);
            this.svg.append('g')
                .attr('id', 'XAxis')
                .call(x)
                .exSetTranslate(0, this.height);
        }
    }
    createYAxis(scale) {
        if (this.isOnceRun) {
            var x = d3.axisLeft(scale);
            this.svg.append('g')
                .attr('id', 'YAxis')
                .call(x)
                .exSetTranslate(0, 0);
        }
    }
}
var svg1 = d3.select('div#chart1 svg');
var svg2 = d3.select('div#chart2 svg');
(() => __awaiter(void 0, void 0, void 0, function* () {
    var data = yield d3.csv('data.csv');
    var names = d3.set(data, d => d.name).values();
    var bar = new Bar('div#chart1 svg', names, 500, 500);
    var data1 = d3.nest()
        .key(d => d.name)
        .rollup(d => d3.sum(d, d => d.value))
        .entries(data);
    bar.Excute(data1);
    setTimeout(() => {
        var data1 = d3.nest()
            .key(d => d.name)
            .rollup(d => d3.sum(d, d => d.value))
            .entries(data.filter(d => d.sex == 'm'));
        bar.Excute(data1);
    }, 2000);
}))();
function show_bars_new(svg, data, key_func, value_func) {
    var height = d3.set(data, key_func).values().length * 40;
    var width = 500;
    svg.attr('height', height);
    var cc = new svg1_1.ChartCreator(svg, height, width);
    var xscale = cc.createScaleLinear(svg1_1.AxisType.X, data, value_func);
    var yscale = cc.createScaleBand(svg1_1.AxisType.Y, data, key_func);
    var texts = svg.selectAll('text')
        .data(data, key_func);
    var bars = svg.selectAll('rect')
        .data(data, key_func);
    var barWidth = 25;
    bars.enter()
        .append('rect')
        .attr('fill', 'red')
        .attr('x', 0)
        .exCalCenterBar('y', yscale, barWidth, key_func)
        .attr('height', barWidth)
        .on('click', function () {
        console.log(this);
    })
        .merge(bars)
        .attr('width', d => xscale(value_func(d)));
    bars.exit()
        .transition().duration(800)
        .attr('width', 0)
        .remove();
    texts.enter()
        .append('text')
        .attr('font-size', 15)
        .exSetCenterText(svg1_1.Direction.H, 'y', yscale, barWidth, key_func)
        .merge(texts)
        .attr('x', d => xscale(value_func(d)))
        .text(value_func);
    texts.exit()
        .attr('opacity', 1)
        .transition().duration(1000)
        .attr('x', 1000)
        .attr('opacity', 0)
        .remove();
    cc.createAxisElement(svg1_1.AxisType.X, d3.axisBottom(xscale));
    cc.createAxisElement(svg1_1.AxisType.Y, d3.axisLeft(yscale));
}
//# sourceMappingURL=test.js.map