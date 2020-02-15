// import * as d3Axis from "d3-axis";
// import * as d3Scale from "d3-scale";
// import * as d3Array from "d3-array";
// import * as d3Selection from "d3-selection";
// import * as d3Collection from "d3-collection";
import * as d3  from "d3";
import "./helper/d3Ex"




export enum AxisType {
    X,
    Y
}

export enum Direction {
    H,
    V
}

export class ChartCreator {
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    height: number;
    width: number;

    constructor(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
        height: number,
        width: number) {
        this.svg = svg
        this.height = height
        this.width = width
    }

    /**
     * Create
     */
    public createScaleLinear<T>(axisType: AxisType, data: T[], fieldFunc: (x: T) => number): d3.ScaleLinear<number, number> {
        var res = d3.scaleLinear()
            .domain([0, d3.max(data, fieldFunc)])

        switch (axisType) {
            case AxisType.X:
                res.range([0, this.width]);
                break;
            case AxisType.Y:
                res.range([this.height, 0]);
                break;
            default:
                break;
        }

        return res
    }

    /**
 * Create
 */
    public createScaleBand<T>(axisType: AxisType, data: T[], fieldFunc: (d: T) => string): d3.ScaleBand<string> {
        var namekeys = d3.set(data, fieldFunc).values()
        var res = d3.scaleBand()
            .domain(namekeys);
        switch (axisType) {
            case AxisType.X:
                res.rangeRound([0, this.width]);
                break;
            case AxisType.Y:
                res.rangeRound([this.height, 0]);
                break;
            default:
                break;
        }


        return res
    }

    /**
     * createAxis
     */
    public createAxisElement<Domain extends d3.AxisDomain>(
        axisType: AxisType, axis: d3.Axis<Domain>): d3.Selection<SVGGElement, unknown, HTMLElement, any> {

        var res = this.svg.append('g')
            .call(axis)
        switch (axisType) {
            case AxisType.X:
                res.exSetTranslate(0,this.height)
                // res.attr('transform', `translate(${0},${this.height})`)
                break;
            case AxisType.Y:
                res.exSetTranslate(0,0)
                // res.attr('transform', `translate(${0},${0})`)
                break;
            default:
                break;
        }


        return res
    }


    /**
     * createBar
     */
    public setCenterBar(bandWidth: number, barWidth: number, scaleValue: number): number {
        var offset = bandWidth / 2 - barWidth + barWidth / 2
        return scaleValue + offset
    }



   

}




// var svg1 = d3.select('div#chart1 svg');
// var svg2 = d3.select('div#chart2 svg');
// function show_bars(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, data: d3.DSVRowArray<string> | {
//     key: string;
//     values: any;
//     value: undefined;
// }[], key_func: (d) => any, value_func: (d) => any, width: number = 800) {
//     var namekeys = d3.set(data, key_func).values();
//     var height = namekeys.length * 40;
//     svg.attr('height', height);
//     var xscale = d3.scaleLinear()
//         .domain([0, d3.max(data, value_func)])
//         .range([0, width]);
//     var yscale = d3.scaleBand()
//         .rangeRound([0, height])
//         // .padding(0.3)
//         .domain(namekeys);
//     var xAxis = d3.axisBottom(xscale);
//     var yAxis = d3.axisLeft(yscale);
//     svg.append('g')
//         .attr('transform', `translate(${0},${0})`)
//         .attr('class', 'yAxis')
//         .call(yAxis);
//     svg.append('g')
//         .attr('transform', `translate(${0},${height})`)
//         // .attr('transform', `translate(${tran.matrix.e},${tran.matrix.f})`)
//         .attr('class', 'xAxis')
//         .call(xAxis);
//     var texts = svg.selectAll('text')
//         .data(data, key_func);
//     var bars = svg.selectAll('rect')
//         .data(data, key_func);
//     bars.enter()
//         .append('rect')
//         .attr('fill', 'red')
//         .attr('x', 0)
//         .attr('y', d => yscale(key_func(d)))
//         .attr('height', yscale.bandwidth() - 5)
//         .attr('width', d => xscale(value_func(d)));
//     bars.on('click', function () {
//         console.log(this);
//     });
//     texts.enter()
//         .append('text')
//         .text(value_func)
//         .attr('font-size', 20)
//         .attr('x', d => xscale(value_func(d)))
//         .attr('y', d => yscale(key_func(d)) + 20);
// }
// (async () => {
//     var data = await d3.csv('data.csv');
//     var data1 = d3.nest()
//         .key(d => d.name)
//         .rollup(d => d3.sum(d, d => d.value))
//         .entries(data);
//     show_bars(svg1, data1, d => d.key, d => d.value);
//     var data2 = d3.nest()
//         .key(d => d.sex)
//         .rollup(d => d3.sum(d, d => d.value))
//         .entries(data);
//     show_bars(svg2, data2, d => d.key, d => d.value);
// })();
