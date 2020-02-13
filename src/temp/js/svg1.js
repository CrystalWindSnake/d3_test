"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3Scale = require("d3-scale");
const d3Array = require("d3-array");
const d3Collection = require("d3-collection");
var AxisType;
(function (AxisType) {
    AxisType[AxisType["X"] = 0] = "X";
    AxisType[AxisType["Y"] = 1] = "Y";
})(AxisType = exports.AxisType || (exports.AxisType = {}));
var Direction;
(function (Direction) {
    Direction[Direction["H"] = 0] = "H";
    Direction[Direction["V"] = 1] = "V";
})(Direction = exports.Direction || (exports.Direction = {}));
class ChartCreator {
    constructor(svg, height, width) {
        this.svg = svg;
        this.height = height;
        this.width = width;
    }
    createScaleLinear(axisType, data, fieldFunc) {
        var res = d3Scale.scaleLinear()
            .domain([0, d3Array.max(data, fieldFunc)]);
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
        return res;
    }
    createScaleBand(axisType, data, fieldFunc) {
        var namekeys = d3Collection.set(data, fieldFunc).values();
        var res = d3Scale.scaleBand()
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
        return res;
    }
    createAxisElement(axisType, axis) {
        var res = this.svg.append('g')
            .call(axis);
        switch (axisType) {
            case AxisType.X:
                res.attr('transform', `translate(${0},${this.height})`);
                break;
            case AxisType.Y:
                res.attr('transform', `translate(${0},${0})`);
                break;
            default:
                break;
        }
        return res;
    }
    setCenterBar(bandWidth, barWidth, scaleValue) {
        var offset = bandWidth / 2 - barWidth + barWidth / 2;
        return scaleValue + offset;
    }
    callCenterText(selection, direction, attr, bandWidth, barWidth, scaleValue) {
        var offset = bandWidth / 2 - barWidth + barWidth / 2;
        switch (direction) {
            case Direction.H:
                selection.attr('dominant-baseline', 'middle');
                break;
            case Direction.V:
                selection.attr('text-anchor', 'middle');
                break;
            default:
                break;
        }
        selection.attr(attr, scaleValue + offset + barWidth / 2);
    }
}
exports.ChartCreator = ChartCreator;
//# sourceMappingURL=svg1.js.map