import React from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryLabel,
  VictoryAxis,
} from "victory";

export default function HChart({ main, sub, title }) {
  var wrapper_height = main.length * 120
  return (
    <div height={57 * main.length} style={{ borderTop: "1px solid black", borderBottom: "1px solid black",backgroundColor:'rgb(41, 41, 41)',maxHeight:wrapper_height}}>
      <VictoryChart width={400} height={77 * main.length} >
      <VictoryLabel text={title} x={110} y={30} textAnchor="middle" style={{fill:'white'}} />
        <VictoryAxis
        offsetX={48}
          style={{
            ticks: { stroke: "white", size: 5 },
            tickLabels: { fontSize: 5, padding: 1, fill:'white' },
            
            axis:{stroke:'white'}
          }}
        />

        <VictoryGroup horizontal offset={16} style={{ data: { width: 10 },fontSize:'8px' }}>
          <VictoryBar
            style={{
                data: {
                    fill: ({ datum }) => datum.fill,
                    
                },
                labels : {
                    fill:({ datum }) => datum.fill,
                    fontSize:5
                }
            }}
            labels={({ datum }) => (+datum.y).format() + "(" + ((datum.y / main[datum._x - 1].y - 1) * 100).toFixed(2) + "%)"}
            labelComponent={<VictoryLabel dx={1}/>}
            data={sub}
          />

          <VictoryBar
            style={{
              data: { fill: "#4CAF50" },
              labels: { fill: "white", fontSize: 5 },
            }}
            labels={({ datum }) => (+datum.y).format()}
            labelComponent={<VictoryLabel dx={1}/>}
            data={main}
          />
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
}
