import { EventEmitter } from "events";



export class Checker extends EventEmitter {
    constructor() {
        super()
    }

    static readonly OnValueChange = Symbol("OnValueChange")


    /**
     * Changed
onEvent:sym     */
    public Changed(onEvent:symbol,values:any) {
        this.emit(onEvent,values)
    }

}