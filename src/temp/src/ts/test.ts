// import { Checker } from "./D3ValueChecker";
import { ChartCreator, AxisType, Direction } from "./svg1";
import * as d3 from "d3";
import * as cex from  "./helper/ChartEx";


import "./helper/d3Ex"
import { format } from "d3";


interface IData {
    name: string,
    sex: string,
    value: number
}





class Bar extends cex.Chart {
    protected finished(): void {
        this.isOnceRun = false
    }
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
        // this.height = d3.set(data, keyFunc).values().length * 40;
        this.svg.attr('height', 800);
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
    protected createMark<TData>(data: TData[], keyFunc: cex.keyFuncType<TData>, valueFunc: cex.valueFuncType<TData>, xScale: cex.d3Scale, yScale: d3Scale) {


        var bars = this.svg.selectAll('rect')
            .data(data, keyFunc)

        var barHeight = 25

        bars.enter()
            .append('rect')
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


        var texts = this.svg.selectAll('text').data(data, keyFunc)

        var preData = d3.local()


        var allTexts = texts.enter()
            .append('text')
            .attr('font-size', 15)
            .exSetCenterText(Direction.H, 'y', yScale, barHeight, keyFunc)
            .merge(texts)




        allTexts.transition().duration(1000)
            .tween('text', function (d) {
                var realthis = this
                var real = d3.select(this)

                var prev = preData.get(this)
                var start = 0
                var end = valueFunc(d)

                console.log(prev)

                if (prev != undefined) {
                    start = d3.min([prev, valueFunc(d)])
                    end = d3.max([prev, valueFunc(d)])
                }
                else {
                    console.log('else')
                }

                var i = d3.interpolate(start, end);
                console.log(start, end)

                return function (t) {
                    real.text(i(t).toFixed(0))
                }
            })
            // .tween('text',(d,i,gs)=>{
            //     var real=d3.select(gs[i])

            //     console.log(d,real.datum())

            //     var i = d3.interpolate(0,valueFunc(d));
            //     return function(t){
            //         real.text(i(t).toFixed(0))
            //     }
            // })
            .attr('x', d => xScale(d.value))


        // allTexts.each(function (d) {
        //     preData.set(this, valueFunc(d))
        // })

        texts.exit().remove()

    }
    protected createXAxis(scale: cex.d3Scale): void {
        if (this.isOnceRun) {
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


}



 
var svg1 = d3.select('div#chart1 svg');
var svg2 = d3.select('div#chart2 svg');
 
(async () => {

    var data: IData[] = await d3.csv('data.csv');

    var names = d3.set(data, d => d.name).values()

    var bar = new Bar('div#chart1 svg', names, 500, 500)

    var data1 = d3.nest<IData, number>()
        .key(d => d.name)
        .rollup(d => d3.sum(d, d => d.value))
        .entries(data);



    bar.Excute(data1, d => d.key, d => d.value)

    setTimeout(() => {
        var data1 = d3.nest<IData, number>()
            .key(d => d.name)
            .rollup(d => d3.sum(d, d => d.value))
            .entries(data.filter(d => d.sex == 'm'));

        bar.Excute(data1, d => d.key, d => d.value)
    }, 2000)


    // show_bars_new(svg1, data1, d => d.key, d => d.value);

    // var data2 = d3.nest<IData, number>()
    //     .key(d => d.sex)
    //     .rollup(d => d3.sum(d, d => d.value))
    //     .entries(data);
    // show_bars_new(svg2, data2, d => d.key, d => d.value);
})();









