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





class Bar extends cex.Chart {

    private isOnceRun: boolean = true

    private tempXScale: cex.d3Scale
    private tempYScale: cex.d3Scale
    allnames: string[];

    /**
     *
     */
    constructor(svgSelector: string, allnames: string[], height: number, width: number) {
        super(svgSelector, height, width);
        this.allnames = allnames
    }



    protected init<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>): void {
        this.height = d3.set(data, keyFunc).values().length * 40;
        this.svg.attr('height', this.height);
    }
    protected createXScale<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>): cex.d3Scale {
        if (this.isOnceRun) {
            var s = d3.scaleLinear()
                .domain([0, d3.max(data, valueFunc)])
                .range([0, this.width])

            this.tempXScale = s
        }

        return this.tempXScale
    }
    protected createYScale<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>): cex.d3Scale {
        if (this.isOnceRun) {
            var s = d3.scaleBand()
                .domain(this.allnames)
                .rangeRound([0, this.height])

            this.tempYScale = s

        }

        return this.tempYScale
    }
    protected createMark<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>, xScale: cex.d3Scale, yScale: cex.d3Scale) {


        var bars = this.svg.selectAll('rect.bar')
            .data(data, keyFunc)

        var barHeight = 25

        bars.enter()
            .append('rect')
            .attr('class','bar')
            .attr('fill', 'red')
            .attr('height', barHeight)
            .attr('x', 0)
            .exCalCenterBar('y', yScale, barHeight, keyFunc)
            .merge(bars)
            .transition().duration(1000)
            .attr('width', d => xScale(d.value))


        bars.exit()
            .transition().duration(800)
            .attr('width', 0)
            .remove()

        // return



        var preData = d3.local()
        this.svg.selectAll('text.label').each(function (this: Element, d) {
            preData.set(this, valueFunc(d))
        })

        var texts = this.svg.selectAll('text.label').data(data, keyFunc)



        var allTexts = texts.enter()
            .append('text')
            .attr('class','label')
            .attr('font-size', 15)
            .exSetCenterText(cex.Direction.H, 'y', yScale, barHeight, keyFunc)
            .merge(texts)
            .text(valueFunc)
            .attr('x', d => xScale(d.value))



        allTexts.transition().duration(1000)
            .tween('text', function (d) {
                var realthis = this
                var real = d3.select(this)

                var prev = preData.get(this)
                var start = 0
                var end = valueFunc(d)

                if (prev != undefined) {
                    start=prev
                }

                var i = d3.interpolate(start, end);
       
                return function (t) {
                    real.text(i(t).toFixed(0))
                }
            })
            .attr('x', d => xScale(d.value))


        texts.exit()
        .each(function(this:Element,d){
            preData.remove(this)
        })
        .remove()

    }
    protected createXAxis(scale: cex.d3Scale): void {
        if (this.isOnceRun) {
            // console.log('xxx')
            var x = d3.axisBottom(scale)
            this.svg.append('g')
                .attr('id', 'XAxis')
                .call(x)
                .exSetTranslate(0, this.height)
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
        this.isOnceRun=false
    }

}




var svg1 = d3.select('div#chart1 svg');
var svg2 = d3.select('div#chart2 svg');

(async () => {

    // var data: IData[] = await d3.csv('data.csv');
    // console.log(data)

    var data:IData[]=[{"name":"A1","sex":"m","value":10},
    {"name":"A2","sex":"m","value":20},
    {"name":"A3","sex":"m","value":30},
    {"name":"A4","sex":"m","value":40},
    {"name":"A5","sex":"m","value":50},
    {"name":"A6","sex":"m","value":60},
    {"name":"A1","sex":"f","value":100},
    {"name":"A2","sex":"f","value":200},
    {"name":"A4","sex":"f","value":400},
    {"name":"A5","sex":"f","value":500},
    {"name":"A3","sex":"f","value":300},
    {"name":"A7","sex":"f","value":600}]
    

    var names = d3.set(data, d => d.name).values()

    var bar = new Bar('div#chart1 svg', names, 500, 500)

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









