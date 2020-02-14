
// import  * as d3sel from "d3-selection";
// import { Direction } from "./svg1";
// import { Selection } from "d3-selection";




// declare module  "d3-selection" {
//     interface Selection<GElement extends d3.BaseType, Datum, PElement extends d3.BaseType, PDatum> {
//         setCenterText(direction:Direction,
//             attr:string,bandWidth:number,barWidth:number,
//             scaleValueFunc:(any)=>number):d3TextSelection
//     }
// }



// type d3TextSelection =  Selection<SVGTextElement, any, d3.BaseType, unknown>

// d3sel.selection.prototype.setCenterText=function(
//     this:d3TextSelection,
//     direction:Direction,
//     attr:string,bandWidth:number,barWidth:number,
//     scaleValueFunc:(any)=>number){
    
//     var offset = bandWidth / 2 - barWidth + barWidth / 2

//     switch (direction) {
//         case Direction.H:
//             this.attr('dominant-baseline', 'middle')
//             break;
//         case Direction.V:
//             this.attr('text-anchor', 'middle')
//             break;
//         default:
//             break;
//     }

//     this.attr(attr, d=> scaleValueFunc(d) + offset + barWidth / 2)
//     return this
// }


