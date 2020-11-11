import React from "react";
import { VictoryChart,  VictoryPie,VictoryAxis, VictoryLabel } from "victory";

export default function PieChart({ pdata, title }) {
  return (
    <div >
      <VictoryChart widht={500}>

      <VictoryLabel text={title} x={100} y={30} textAnchor="middle" />
        <VictoryAxis
          style={{
            tickLabels: {fill:'none' },
            axis:{stroke:'none'}
          }}
        />
        <VictoryPie
          colorScale={[
            "#D7FEFC",
            "#B1FAFD",
            "#89EDFA",
            "#6ADCF5",
            "#3BC2EF",
            "#2B99CD",
            "#1D74AC",
            "#12538A",
            "#0B3B72",
          ]}
          style={{
            labels: {
              fontSize: 10,
            },
          }}
          data={pdata}
        /> 
      </VictoryChart>
    </div>
  );
}
