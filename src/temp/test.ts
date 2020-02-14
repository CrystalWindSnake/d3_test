import { Checker } from "./D3ValueChecker";
import { ChartCreator, AxisType, Direction } from "./svg1";
import * as d3 from "d3";
// import * as d3Slt from "d3-selection";
// import * as d3Clt from "d3-collection";
// import * as d3Sca from "d3-scale";
// import * as d3Arr from "d3-array";
// import * as d3Ax from "d3-axis";
// import * as d3Ft from "d3-fetch";

import "./helper/d3Ex"
import { type } from "os";
import { text, contourDensity } from "d3";


interface IData {
    name: string,
    sex: string,
    value: number
}


// type stringKeyFunc<T> = (data:T) => string
// type numberKeyFunc<T> = (data:T) => number
// type keyFunc<T> = stringKeyFunc<T> | numberKeyFunc<T>
// type d3Scale = d3.ScaleLinear<number, number> | d3.ScaleBand<string>

// class BarChart {
//     private svgSelector: string;
//     svg:d3.Selection<d3.BaseType, unknown, HTMLElement, any>
//     xScale:d3Scale
//     yScale:d3Scale
//     data:any
//     xAxis:d3.Axis<d3.AxisDomain>
//     yAxis:d3.Axis<d3.AxisDomain>

//     constructor(svgSelector: string) {
//         this.svgSelector = svgSelector
//         this.svg=d3.select(svgSelector)
//     }




//     /**
//      * DataEncoding
// data     */
//     public Encoding<T>(data: T[], x:keyFunc<T>,y:keyFunc<T>) {
//         this.data=data
//         var xv = x(data[0])
//         if (typeof xv === 'string') {
//             this.xScale = d3.scaleBand()
//                     .domain(d3.set(data,x).values());
//         }
//         else{
//             this.xScale =  d3.scaleLinear()
//             .domain([0, d3.max(data, x)])
//         }
//         this.xAxis = d3.axisBottom(this.xScale)

//         var yv = y(data[0])
//         if (typeof yv === 'string') {
//             this.yScale = d3.scaleBand()
//                     .domain(d3.set(data,y).values());
//         }
//         else{
//             this.yScale =  d3.scaleLinear()
//             .domain([0, d3.max(data, y)])
//         }
//         this.yAxis = d3.axisLeft(this.yScale)
//     }


//     /**
//      * create
//      */
//     public createAxis() {
//         var res = this.svg.append('g')
//         .call(this.xAxis)
//         .attr.attr('transform', `translate(${0},${this.height})`)
//     switch (axisType) {
//         case AxisType.X:
//             res.attr('transform', `translate(${0},${this.height})`)
//             break;
//         case AxisType.Y:
//             res.attr('transform', `translate(${0},${0})`)
//             break;
//         default:
//             break;
//     }
//     }

// }


type d3Scale = d3.AxisScale<d3.AxisDomain>


abstract class Chart<TData> {
    private initRunned: boolean = false
    svgSelector: string;
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    height: number;
    width: number;

    /**
     *
     */
    constructor(svgSelector: string, height: number, width: number) {
        this.svgSelector = svgSelector
        this.height = height
        this.width = width
        this.svg = d3.select(svgSelector)
    }

    protected abstract init(data: TData[]): void

    protected abstract createXScale(data: TData[]): d3Scale

    protected abstract createYScale(data: TData[]): d3Scale

    protected abstract createMark(data: TData[], xScale: d3Scale, yScale: d3Scale)

    protected abstract createXAxis(scale: d3Scale): void

    protected abstract createYAxis(scale: d3Scale): void

    protected abstract finished(): void

    /**
     * Excute<T>
data:T[]     */
    public Excute(data: TData[]) {
        if (!this.initRunned) {
            this.init(data)
            this.initRunned = true
        }


        var xScale = this.createXScale(data)
        var yScale = this.createYScale(data)



        this.createMark(data, xScale, yScale)
        this.createXAxis(xScale)
        this.createYAxis(yScale)
    }
}

class Bar<TData> extends Chart<TData> {
    protected finished(): void {
        this.isOnceRun=false
    }
    private isOnceRun:boolean=true
    private keyFunc = d => d.key
    private valueFunc = d => d.value

    private tempXScale: d3Scale
    private tempYScale: d3Scale
    allnames: string[];

    /**
     *
     */
    constructor(svgSelector: string, allnames: string[], height: number, width: number) {
        super(svgSelector, height, width);
        this.allnames = allnames
    }



    protected init(data: TData[]): void {
        this.height = d3.set(data, this.keyFunc).values().length * 40;
        this.svg.attr('height', this.height);
    }
    protected createXScale(data: TData[]): d3Scale {
        if (this.isOnceRun) {
            var s = d3.scaleLinear()
                .domain([0, d3.max(data, this.valueFunc)])
                .range([0, this.width])

            this.tempXScale = s
        }

        return this.tempXScale
    }
    protected createYScale(data: TData[]): d3Scale {
        if (this.isOnceRun) {
            var s = d3.scaleBand()
                .domain(this.allnames)
                .rangeRound([0, this.height])

            this.tempYScale = s

        }

        return this.tempYScale
    }
    protected createMark(data: TData[], xScale: d3Scale, yScale: d3Scale) {


        var bars = this.svg.selectAll('rect')
            .data(data, this.keyFunc)

        var barHeight = 25

        bars.enter()
            .append('rect')
            .attr('fill', 'red')
            .attr('height', barHeight)
            .attr('x', 0)
            .exCalCenterBar('y', yScale, barHeight, this.keyFunc)
            .merge(bars)
            .transition().duration(1000)
            .attr('width', d => xScale(d.value))


        bars.exit()
            .transition().duration(800)
            .attr('width', 0)
            .remove()

        var texts = this.svg.selectAll('text').data(data, this.keyFunc)



        texts.enter()
            .append('text')
            .attr('font-size', 15)
            .exSetCenterText(Direction.H, 'y', yScale, barHeight, this.keyFunc)
            .merge(texts)
            .transition().duration(1000)
            .tween('text',(d,i,gs)=>{
                var real=d3.select(gs[i])

                console.log(d,real.datum())

                var i = d3.interpolate(0,this.valueFunc(d));
                return function(t){
                    real.text(i(t).toFixed(0))
                }
            })
            .attr('x', d => xScale(d.value))
            // .text(this.valueFunc)

        texts.exit().remove()

    }
    protected createXAxis(scale: d3Scale): void {
        if (this.isOnceRun) {
            var x = d3.axisBottom(scale)
            this.svg.append('g')
                .attr('id', 'XAxis')
                .call(x)
                .exSetTranslate(0, this.height)
        }
    }
    protected createYAxis(scale: d3Scale): void {
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

    bar.Excute(data1)

    setTimeout(() => {
        var data1 = d3.nest<IData, number>()
            .key(d => d.name)
            .rollup(d => d3.sum(d, d => d.value))
            .entries(data.filter(d => d.sex == 'm'));

        bar.Excute(data1)
    }, 2000)


    // show_bars_new(svg1, data1, d => d.key, d => d.value);

    // var data2 = d3.nest<IData, number>()
    //     .key(d => d.sex)
    //     .rollup(d => d3.sum(d, d => d.value))
    //     .entries(data);
    // show_bars_new(svg2, data2, d => d.key, d => d.value);
})();










///--------------------------------


function show_bars_new(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    data: IData[],
    key_func: (d: IData) => string,
    value_func: (d: IData) => number,

) {

    var height = d3.set(data, key_func).values().length * 40;
    var width = 500
    svg.attr('height', height);
    var cc = new ChartCreator(svg, height, width)


    var xscale = cc.createScaleLinear(AxisType.X, data, value_func)
    var yscale = cc.createScaleBand(AxisType.Y, data, key_func)


    var texts = svg.selectAll('text')
        .data(data, key_func);
    var bars = svg.selectAll('rect')
        .data(data, key_func)
    // .attr('fill', 'red')


    var barWidth = 25

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
        .attr('width', d => xscale(value_func(d)))

    bars.exit()
        .transition().duration(800)
        .attr('width', 0)
        .remove()



    texts.enter()
        .append('text')
        // .text(value_func)
        .attr('font-size', 15)
        // .attr('x', d => xscale(value_func(d)))
        .exSetCenterText(Direction.H,
            'y', yscale, barWidth, key_func)
        .merge(texts)
        .attr('x', d => xscale(value_func(d)))
        .text(value_func)



    texts.exit()
        .attr('opacity', 1)
        .transition().duration(1000)
        .attr('x', 1000)
        .attr('opacity', 0)
        .remove()

    cc.createAxisElement(AxisType.X, d3.axisBottom(xscale))
    cc.createAxisElement(AxisType.Y, d3.axisLeft(yscale))

}



// (async () => {


//     var data: IData[] = await d3.csv('data.csv');

//     var names = d3.set(data, d => d.sex).values()

//     var selectNames = d3.select('select#names')


//     selectNames.selectAll('option')
//         .data(names)
//         .enter()
//         .append('option')
//         .attr('value', d => d)
//         .text(d => d)


//     selectNames.on('change', function () {
//         console.log(this.value)

//         var data1 = d3.nest<IData, number>()
//             .key(d => d.name)
//             .rollup(d => d3.sum(d, d => d.value))
//             .entries(data.filter(d => d.sex == this.value));

//         show_bars_new(svg1, data1, d => d.key, d => d.value);
//     })



//     var data1 = d3.nest<IData, number>()
//         .key(d => d.name)
//         .rollup(d => d3.sum(d, d => d.value))
//         .entries(data);

//     show_bars_new(svg1, data1, d => d.key, d => d.value);

//     var data2 = d3.nest<IData, number>()
//         .key(d => d.sex)
//         .rollup(d => d3.sum(d, d => d.value))
//         .entries(data);
//     show_bars_new(svg2, data2, d => d.key, d => d.value);
// });



