import * as d3 from "d3";

export enum Direction {
    H,
    V
}

export type d3Scale = d3.AxisScale<d3.AxisDomain>
export type keyFuncType<T> = (d: T) => string
export type valueFuncType<T> = (d: T) => number

export abstract class Chart {
    private initRunned: boolean = false
    svgSelector: string;
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    height: number;
    width: number;

    /**
     *
     */
    constructor(svgSelector: string,width: number, height: number) {
        this.svgSelector = svgSelector
        this.height = height
        this.width = width
        this.svg = d3.select(svgSelector)
    }

    protected abstract init<TData>(data: TData[], keyFunc: keyFuncType<TData>, valueFunc: valueFuncType<TData>): void

    protected abstract createXScale<TData>(data: TData[], keyFunc: keyFuncType<TData>, valueFunc: valueFuncType<TData>): d3Scale

    protected abstract createYScale<TData>(data: TData[], keyFunc: keyFuncType<TData>, valueFunc: valueFuncType<TData>): d3Scale

    protected abstract createMark<TData>(data: TData[], keyFunc: keyFuncType<TData>, valueFunc: valueFuncType<TData>, xScale: d3Scale, yScale: d3Scale)

    protected abstract createXAxis(scale: d3Scale): void

    protected abstract createYAxis(scale: d3Scale): void

    protected abstract finished(): void

    /**
     * Excute<T>
data:T[]     */
    public Excute<TData>(data: TData[], keyFunc: keyFuncType<TData>, valueFunc: valueFuncType<TData>) {
        if (!this.initRunned) {
            this.init(data, keyFunc, valueFunc)
            this.initRunned = true
        }


        var xScale = this.createXScale(data, keyFunc, valueFunc)
        var yScale = this.createYScale(data, keyFunc, valueFunc)



        this.createMark(data, keyFunc, valueFunc, xScale, yScale)
        this.createXAxis(xScale)
        this.createYAxis(yScale)

        this.finished()
    }
}