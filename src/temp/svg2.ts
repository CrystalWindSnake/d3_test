import { Selection as d3Selection } from "d3-selection";
import * as d3sel  from "d3-selection";

declare module  "d3-selection" {
    interface Selection<GElement extends d3sel.BaseType, Datum, PElement extends d3sel.BaseType, PDatum> {
        setCenterText():d3sel.Selection<GElement, Datum, PElement, PDatum>
    }
}

Selection.prototype.setCenterText=
    function<GElement extends d3sel.BaseType, 
        Datum, 
        PElement extends d3sel.BaseType, 
        PDatum>
        ():string{
    return 'xxx'
}

