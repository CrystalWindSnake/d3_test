"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
var Direction;
(function (Direction) {
    Direction[Direction["H"] = 0] = "H";
    Direction[Direction["V"] = 1] = "V";
})(Direction = exports.Direction || (exports.Direction = {}));
d3.selection.prototype.exCalCenterBar = function (name, scale, barWidth, valueFunc) {
    var offset = scale.bandwidth() / 2 - barWidth + barWidth / 2;
    this.attr(name, d => scale(valueFunc(d)) + offset);
    return this;
};
d3.selection.prototype.exSetTranslate = function (x, y) {
    this.attr('transform', `translate(${x},${y})`);
    return this;
};
d3.selection.prototype.exSetCenterText = function (direction, attr, scale, barWidth, valueFunc) {
    var offset = scale.bandwidth() / 2 - barWidth + barWidth / 2;
    switch (direction) {
        case Direction.H:
            this.attr('dominant-baseline', 'middle');
            break;
        case Direction.V:
            this.attr('text-anchor', 'middle');
            break;
        default:
            break;
    }
    this.attr(attr, d => scale(valueFunc(d)) + offset + barWidth / 2);
    return this;
};
//# sourceMappingURL=d3Ex.js.map