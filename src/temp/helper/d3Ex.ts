
import * as d3 from "d3";
import { Selection } from "d3-selection";

export enum Direction {
    H,
    V
}

type d3TextSelection = Selection<SVGTextElement, any, d3.BaseType, unknown>
type d3Scale = d3.AxisScale<d3.AxisDomain>

declare module "d3-selection" {
    interface Selection<GElement extends d3.BaseType, Datum, PElement extends d3.BaseType, PDatum> {
        exSetCenterText(direction: Direction,
            attr: string, scale: d3Scale, barWidth: number,
            valueFunc: (d: Datum) => string): d3TextSelection

        exSetTranslate(x: number, y: number): this

        exCalCenterBar(name: string, scale: d3Scale, barWidth: number, valueFunc: (d: Datum) => string): this
    }
}


d3.selection.prototype.exCalCenterBar = function (
    this: Selection<HTMLElement, any, null, undefined>,
    name: string,
    scale: d3Scale,
    barWidth: number, valueFunc: (d) => string) {

    var offset = scale.bandwidth() / 2 - barWidth + barWidth / 2

    this.attr(name, d => scale(valueFunc(d)) + offset)
    return this
}


d3.selection.prototype.exSetTranslate = function (
    this: Selection<HTMLElement, any, null, undefined>,
    x: number, y: number) {

    this.attr('transform', `translate(${x},${y})`)
    return this
}


d3.selection.prototype.exSetCenterText = function (
    this: d3TextSelection,
    direction: Direction,
    attr: string, scale: d3Scale, barWidth: number,
    valueFunc: (d) => string) {

    var offset = scale.bandwidth() / 2 - barWidth + barWidth / 2

    switch (direction) {
        case Direction.H:
            this.attr('dominant-baseline', 'middle')
            break;
        case Direction.V:
            this.attr('text-anchor', 'middle')
            break;
        default:
            break;
    }

    this.attr(attr, d => scale(valueFunc(d)) + offset + barWidth / 2)
    return this
}


