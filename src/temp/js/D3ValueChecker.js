"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Checker extends events_1.EventEmitter {
    constructor() {
        super();
    }
    Changed(onEvent, values) {
        this.emit(onEvent, values);
    }
}
exports.Checker = Checker;
Checker.OnValueChange = Symbol("OnValueChange");
//# sourceMappingURL=D3ValueChecker.js.map