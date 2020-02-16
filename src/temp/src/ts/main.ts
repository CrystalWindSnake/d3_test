// import { Checker } from "./D3ValueChecker";
// import { ChartCreator, AxisType, Direction } from "./svg1";
import * as d3 from "d3";
import * as cex from "./helper/ChartEx";


import "./helper/d3Ex"


interface IData {
    name: string,
    sex: string,
    value: number
}


class PaddingDim {
    top: number
    bottom: number
    left: number
    right: number
    width: number
    height: number

    public get realWidth(): number {
        return this.width - this.left - this.right
    }


    public get realHeight(): number {
        return this.height - this.top - this.bottom
    }

}


class Bar extends cex.Chart {

    private isOnceRun: boolean = true

    private tempXScale: cex.d3Scale
    private tempYScale: cex.d3Scale
    allnames: string[];
    private paddingDim: PaddingDim

    /**
     *
     */
    constructor(svgSelector: string, allnames: string[], width: number, height: number) {
        super(svgSelector, width, height);
        this.allnames = allnames
    }



    protected init<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>): void {
        // this.height = d3.set(data, keyFunc).values().length * 40+120 ;
        this.paddingDim = new PaddingDim()
        this.paddingDim.top = 30
        this.paddingDim.bottom = 30
        this.paddingDim.left = 30
        this.paddingDim.right = 30

        this.paddingDim.width = this.width
        this.paddingDim.height = this.height

        this.svg.attr('height', this.paddingDim.height);
        this.svg.attr('width', this.paddingDim.width);

        this.svg = this.svg.append('g')
            .exSetTranslate(this.paddingDim.left, this.paddingDim.top)

    }
    protected createXScale<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>): cex.d3Scale {
        if (this.isOnceRun) {
            var s = d3.scaleLinear()
                .domain([0, d3.max(data, valueFunc)])
                .range([0, this.paddingDim.realWidth])

            this.tempXScale = s
        }

        return this.tempXScale
    }
    protected createYScale<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>): cex.d3Scale {
        if (this.isOnceRun) {
            var s = d3.scaleBand()
                .domain(this.allnames)
                .rangeRound([0, this.paddingDim.realHeight])

            this.tempYScale = s

        }

        return this.tempYScale
    }
    protected createMark<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>, xScale: cex.d3Scale, yScale: cex.d3Scale) {
        const t: d3.Transition<d3.BaseType, unknown, HTMLElement, any> = this.svg.transition()
            .duration(750);

        var barHeight = yScale.bandwidth() * 0.65

        function enterRect(rect: d3.Selection<SVGGElement, TData, d3.BaseType, unknown>): void {
            rect.append('rect')
                .attr('fill', 'red')
                .attr('height', barHeight)
                .attr('x', 0)
                .exSetCenterBar('y', yScale, barHeight, keyFunc)
                .transition(t)
                .attr('width', d => xScale(d.value))
        }

        function updateRect(rect: d3.Selection<SVGGElement, TData, d3.BaseType, unknown>): void {
            rect.transition(t)
                .attr('width', d => xScale(d.value))
        }

        var preData = d3.local()
        this.svg.selectAll('g.bar text').each(function (this: Element, d) {
            preData.set(this, valueFunc(d))
        })

        function enter_updateText(text: d3.Selection<SVGTextElement, TData, d3.BaseType, unknown>): void {
            text.attr('x', d => xScale(d.value))
                .text(valueFunc)
                .transition(t)
                .tween('text', function (d) {
                    var realthis = this
                    var real = d3.select(this)

                    var prev = preData.get(this)
                    var start = 0
                    var end = valueFunc(d)

                    if (prev != undefined) {
                        start = prev
                    }

                    var i = d3.interpolate(start, end);

                    return function (t) {
                        var v = i(t).toFixed(0)
                        real.text(v)
                        real.attr('x', d => xScale(v))
                    }
                })
        }

        function enterText(text: d3.Selection<SVGTextElement, TData, d3.BaseType, unknown>): void {
            text.append('text')
                .attr('class', 'label')
                .attr('font-size', 15)
                .exSetCenterText(cex.Direction.H, 'y', yScale, barHeight, keyFunc)
                .call(enter_updateText)

        }

        function updateText(text: d3.Selection<SVGTextElement, TData, d3.BaseType, unknown>): void {
            text.call(enter_updateText)
        }

        function exitText(text: d3.Selection<SVGTextElement, TData, d3.BaseType, unknown>): void {
            text.each(function (this: Element, d) {
                preData.remove(this)
            })
            .transition(t)
            .attr('x',0)
        }


        var bars = this.svg.selectAll('g.bar')
            .data(data, keyFunc)
            .join(
                enter => {
                    var gs = enter.append('g').attr('class', 'bar')
                    gs.call(enterRect)
                    gs.call(enterText)
                    return gs
                }
                ,
                update => {
                    update.select('rect').call(updateRect)
                    update.select('text').call(updateText)

                    return update
                }
                ,
                exit => {
                    exit.transition(t)
                        .select('rect')
                        .attr('width', 0)

                    exit.select('text').call(exitText)
                    exit.transition(t).remove()
                }
            )


    }
    protected createXAxis(scale: cex.d3Scale): void {
        if (this.isOnceRun) {
            // console.log('xxx')
            var x = d3.axisBottom(scale)
            this.svg.append('g')
                .attr('id', 'XAxis')
                .call(x)
                .exSetTranslate(0, this.paddingDim.realHeight)
        }
    }
    protected createYAxis(scale: cex.d3Scale): void {
        if (this.isOnceRun) {

            var x = d3.axisLeft(scale)
            this.svg.append('g')
                .attr('id', 'YAxis')
                .call(x)
                .exSetTranslate(0, 0)

        }

    }

    protected finished(): void {
        this.isOnceRun = false
    }

}




var svg1 = d3.select('div#chart1 svg');
var svg2 = d3.select('div#chart2 svg');

(async () => {

    // var data: IData[] = await d3.csv('data.csv');
    // console.log(data)

    var data: IData[] =
        [{ "name": "A1", "sex": "m", "value": 10 },
        { "name": "A2", "sex": "m", "value": 20 },
        { "name": "A3", "sex": "m", "value": 30 },
        { "name": "A4", "sex": "m", "value": 40 },
        { "name": "A5", "sex": "m", "value": 50 },
        { "name": "A6", "sex": "m", "value": 60 },
        { "name": "A1", "sex": "f", "value": 100 },
        { "name": "A2", "sex": "f", "value": 200 },
        { "name": "A4", "sex": "f", "value": 400 },
        { "name": "A5", "sex": "f", "value": 500 },
        { "name": "A3", "sex": "f", "value": 300 },
        { "name": "A7", "sex": "f", "value": 600 }]


    var names = d3.set(data, d => d.name).values()




    var bar = new Bar('svg', names, 800, 300)

    var data1 = d3.nest<IData, number>()
        .key(d => d.name)
        .rollup(d => d3.sum(d, d => d.value))
        .entries(data.filter(d => d.sex == 'f'));



    bar.Excute(data1, d => d.key, d => d.value)

    setTimeout(() => {
        var data1 = d3.nest<IData, number>()
            .key(d => d.name)
            .rollup(d => d3.sum(d, d => d.value))
            .entries(data.filter(d => d.sex == 'm'));

        bar.Excute(data1, d => d.key, d => d.value)
    }, 2000)



})();









