import bb, {line} from 'billboard.js';
import {makeHumanReadable} from './utils';


export function generateChart(divArray, princArray) {
    let graphObject = null;
    let y2axisMaxRange = parseInt(divArray[divArray.length - 1]);
    let y1axisMaxRange = parseInt(princArray[princArray.length - 1]) * 1.1;
    console.log(
      "----> Div Max Axis " +
        y2axisMaxRange +
        "\n ----> Principle Max Axis :" +
        y1axisMaxRange
    );
    graphObject = bb.generate({
      bindto: "#chart",
      data: {
        type: line(),
        columns: [princArray, divArray],
        axes: {
          Principle: "y",
          Principle2: "y2",
          Dividend: "y3",
        },
      },
      grid: {
        x: {
          show: true,
        },
        y: {
          show: true,
        },
      },
      axis: {
        x: {
          label: "Year",
        },
        y: {
          label: "Dollers ($)",
          // max: eval(y1axisMaxRange),
          // min: 0,
        } /*
              y2: {
                show: true,
                label: "Principle $",
              },
              y3: {
                show: true,
                label: "Dividend $",
                
                max: y2axisMaxRange*2,
                min: 0,
              }*/,
      },
      tooltip: {
        init: {
          show: false,
          
        },
        doNotHide: false,
        contents: {
  
          template: "<table><tbody><tr><th colspan='2'>Year {=TITLE}</th></tr>{{<tr><td class=name><span style='background-color:{=COLOR}; width:10px; height:10px; margin:auto; display:inline-block; align-self:center; margin:0 .5em 0 .5em; border-radius:1px;'></span><span>{=NAME}</span></td><td class=value>{=VALUE}<td></td></tr>}}</tbody></table>"
        },
        format: {
          value: function(value,ratio,id) {
              return "$"+makeHumanReadable(value);
          }
        }
      },
    });
    return graphObject;
  }