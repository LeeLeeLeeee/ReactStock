import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import LabelCheckBox from "../molecules/LabelCheckBox";
import LabelRadio from "../molecules/LabelRadio";
import { connect } from "react-redux";
import { select, groupChoice, setAllStock } from "../modules/stock";
import { getList } from "../modules/stocklist";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import SearchIcon from "@material-ui/icons/Search";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  VictoryChart,
  VictoryCandlestick,
  VictoryAxis,
  VictoryLabel,
  VictoryLine,
  VictoryBar,
} from "victory";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: "#333333",
    marginTop: theme.spacing(1),
    textAlign: "left",
    "& > .sublabel": {
      borderRight: "1px solid #b7b7b7",
      margin: "5px",
      padding: "5px",
      display: "inline-block",
      "& > span": {
        color: "#0e28e2",
      },
    },
  },
  Btn: {
    cursor: "pointer",
    "&:hover": {
      color: "#e0e000",
    },
  },
  Box: {
    padding: theme.spacing(1),
    borderBottom: "1px solid #b7b7b7",
    margin: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    "& > span": {
      display: "inline-flex",
    },
  },
}));

const Analyze = function ({ select, getList, history, match, allStock }) {
  const classes = useStyles();
  /* 
    const assist_chart = ["CCI","OBV","RSI","MACD","볼린저밴드","이동평균","가중이동평균"]
    const chart_type = ["캔들스틱","선형 그래프"] 
  */
  const [graphData, setGraphData] = useState([]);
  const [code, setCode] = useState(match.params.code);
  const [codeName, setCodeName] = useState("");
  const [lastCost, setLastCost] = useState({});
  const [chartType, setCartType] = useState("1");
  const [stockInfo, setStockInfo] = useState({});

  const chartTypeSelect = (e) => {
    setCartType(e.target.value);
  };

  useEffect(() => {
    document.getElementById("radio1").setAttribute("checked", "true");

    fetch("/api/get_stock?code=" + code, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setCodeName(res[0].stock_name);
      });

    fetch("/py/setNewData?code=" + code, {
      method: "GET",
    })
      .then(() => {
        fetch("/py/readStockData?code=" + code + "&current=n", {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res[code].length > 0) {
              var stock = res[code].slice(0, 90);
              setLastCost(stock[0]);
              var graphdata = stock.map(function (item) {
                return {
                  x: item[0],
                  close: +item[1].replace(/,/g, ""),
                  open: +item[3].replace(/,/g, ""),
                  high: +item[4].replace(/,/g, ""),
                  low: +item[5].replace(/,/g, ""),
                };
              });
    
              setGraphData(graphdata.reverse());
            }
          });
          fetch("/py/getSrim?code=" + code, {
            method: "GET",
          })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              setStockInfo(res);
            });


      })
      

    

    
  }, [code]);

  return (
    <div style={{ "padding-top": "50px" }}>
      <AppBar position="fixed">
        <Toolbar>
          <span id={"home"} className={"p-1"}>
            VicStock
          </span>
          <input
            type="text"
            className={"form-control d-inline-block m-1"}
            list={"stocklist"}
            style={{ width: "150px" }}
          />
          <datalist id="stocklist">
            {(() => {
              return allStock.map((item) => {
                return (
                  <option value={item["stock_cd"]}>{item["stock_name"]}</option>
                );
              });
            })()}
          </datalist>
        </Toolbar>
      </AppBar>
      <Grid container direction="row" justify="center" spacing={1}>
        <Grid item xs={12} lg={10}>
          <Paper className={classes.paper}>
            <label style={{ display: "flex" }}>
              <StarBorderIcon className={classes.Btn} />
              <b style={{ marginLeft: "5px" }}>{codeName}</b>
            </label>
            <Grid container direction="row" spacing={1}>
              <Grid item lg={2} xs={5} className={classes.Box}>
                <span> 시가 </span>
                <span> {lastCost[3]}￦ </span>
              </Grid>
              <Grid item lg={2} xs={5} className={classes.Box}>
                <span> 종가 </span>
                <span> {lastCost[1]}￦ </span>
              </Grid>
              <Grid item lg={2} xs={5} className={classes.Box}>
                <span> 고가 </span>
                <span> {lastCost[4]}￦ </span>
              </Grid>
              <Grid item lg={2} xs={5} className={classes.Box}>
                <span> 저가 </span>
                <span> {lastCost[5]}￦ </span>
              </Grid>
            </Grid>
            <div
              className={classes.paper}
              style={{
                border: "1px solid #bebfbf",
                fontWeight: "bold",
                fontSize: "11px",
              }}
            >
              {(() => {
                if (Object.keys(stockInfo).length === 0) {
                  return <CircularProgress />;
                } else {
                  var srim_data = stockInfo.srim.map(function (item, i) {
                    var label = "";
                    switch (i) {
                      case 0:
                        label = "지속 시";
                        break;
                      case 1:
                        label = "10% 감소시";
                        break;
                      case 2:
                        label = "20% 감소시";
                        break;
                      case 3:
                        label = "30% 감소시";
                        break;
                      case 4:
                        label = "40% 감소시";
                        break;
                      case 5:
                        label = "50% 감소시";
                        break;
                    }
                    return { y: item, x: label };
                  });
                  return (
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-lg-6 col-12">
                          <div
                            className="p-2 border rounded d-flex justify-content-between"
                            style={{ fontSize: ".5rem" }}
                          >
                            <span>
                              총 주식 수{" "}
                              {stockInfo["total_num"].toLocaleString()} 개 /
                              외국인 보유 비율{" "}
                              {(+stockInfo["fre_ratio"]).toFixed(2)} %
                            </span>
                            <span className="text-primary">단위(억원/%)</span>
                          </div>
                          <table
                            className="table text-center table-sm table-bordered"
                            style={{ tableLayout: "fixed", fontSize: ".5rem" }}
                          >
                            <tr className="bg-light">
                              <td>구분</td>
                              {(() => {
                                var d = new Date();
                                var y = d.getFullYear();
                                return Array(4)
                                  .fill("")
                                  .map((t, i) => {
                                    return <td>{y - 3 + i}</td>;
                                  });
                              })()}
                              <td>성장성</td>
                            </tr>
                            <tr>
                              <td>영업 이익</td>
                              {(() => {
                                let td_list = stockInfo["bsp"].map((t, i) => {
                                  return <td>{(+t).toLocaleString()}</td>;
                                });
                                let weight_average =
                                  stockInfo["bsp"]
                                    .slice(0, 3)
                                    .reduce((p, v, i) => {
                                      return p + +v * (i + 1);
                                    }, 0) / 6;
                                let average =
                                  stockInfo["bsp"]
                                    .slice(0, 3)
                                    .reduce((p, v, i) => {
                                      return p + +v;
                                    }, 0) / 3;
                                td_list.push(
                                  weight_average < average ? (
                                    <td className="text-secondary">
                                      <i class="fas fa-cloud"></i>
                                    </td>
                                  ) : (
                                    <td className="text-warning">
                                      <i class="far fa-sun"></i>
                                    </td>
                                  )
                                );
                                return td_list;
                              })()}
                            </tr>
                            <tr>
                              <td>영업 이익률</td>
                              {(() => {
                                let td_list = stockInfo["bsp_ratio"].map(
                                  (t, i) => {
                                    return <td>{(+t).toLocaleString()}</td>;
                                  }
                                );
                                let weight_average =
                                  stockInfo["bsp_ratio"]
                                    .slice(0, 3)
                                    .reduce((p, v, i) => {
                                      return p + +v * (i + 1);
                                    }, 0) / 6;
                                let average =
                                  stockInfo["bsp_ratio"]
                                    .slice(0, 3)
                                    .reduce((p, v, i) => {
                                      return p + +v;
                                    }, 0) / 3;
                                td_list.push(
                                  weight_average < average ? (
                                    <td className="text-secondary">
                                      <i class="fas fa-cloud"></i>
                                    </td>
                                  ) : (
                                    <td className="text-warning">
                                      <i class="far fa-sun"></i>
                                    </td>
                                  )
                                );
                                return td_list;
                              })()}
                            </tr>
                            <tr>
                              <td>부채 비율</td>
                              {(() => {
                                let td_list = stockInfo["debt_ratio"].map(
                                  (t, i) => {
                                    return <td>{(+t).toLocaleString()}</td>;
                                  }
                                );
                                let weight_average =
                                  stockInfo["debt_ratio"]
                                    .slice(0, 3)
                                    .reduce((p, v, i) => {
                                      return p + +v * (i + 1);
                                    }, 0) / 6;
                                let average =
                                  stockInfo["debt_ratio"]
                                    .slice(0, 3)
                                    .reduce((p, v, i) => {
                                      return p + +v;
                                    }, 0) / 3;
                                td_list.push(
                                  weight_average > average ? (
                                    <td className="text-secondary">
                                      <i class="fas fa-cloud"></i>
                                    </td>
                                  ) : (
                                    <td className="text-warning">
                                      <i class="far fa-sun"></i>
                                    </td>
                                  )
                                );
                                return td_list;
                              })()}
                            </tr>
                            <tr>
                              <td>ROE</td>
                              {(() => {
                                let roe = stockInfo["roe"].slice(0, 4);
                                let td_list = roe.map((t, i) => {
                                  return <td>{(+t).toLocaleString()}</td>;
                                });
                                let weight_average =
                                  roe.slice(0, 3).reduce((p, v, i) => {
                                    return p + +v * (i + 1);
                                  }, 0) / 6;
                                let average =
                                  roe.slice(0, 3).reduce((p, v, i) => {
                                    return p + +v;
                                  }, 0) / 3;
                                td_list.push(
                                  weight_average < average ? (
                                    <td className="text-secondary">
                                      <i class="fas fa-cloud"></i>
                                    </td>
                                  ) : (
                                    <td className="text-warning">
                                      <i class="far fa-sun"></i>
                                    </td>
                                  )
                                );
                                return td_list;
                              })()}
                            </tr>
                          </table>
                        </div>
                        <div className="col-lg-6 col-12 border">
                          <div className="h5 pt-3">S-RIM 적정주가 산정</div>
                          <div className="p-2 border rounded">
                            현재 주가 : {lastCost[1]}원 / 적정 주가 :{" "}
                            {srim_data[0].y.toLocaleString()}원 /
                            <span className="text-primary">
                              {" "}
                              현 주가 대비{" "}
                              {(
                                (+lastCost[1].replace(/,/g, "") /
                                  srim_data[0].y) *
                                100
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                          <VictoryChart domainPadding={{ x: 20 }}>
                            <VictoryAxis
                              style={{
                                ticks: { stroke: "grey", size: 5 },
                                tickLabels: {
                                  fontSize: 7,
                                  padding: 5,
                                  fontWeight: "bold",
                                },
                              }}
                            />
                            <VictoryAxis
                              dependentAxis
                              style={{
                                axis: { stroke: "#756f6a" },
                                grid: {
                                  stroke: "grey",
                                },
                                ticks: { stroke: "grey", size: 7 },
                                tickLabels: {
                                  fontSize: 7,
                                  padding: 5,
                                  fontWeight: "bold",
                                },
                              }}
                            />
                            <VictoryBar
                              data={srim_data}
                              barWidth={25}
                              animate={{ duration: 250 }}
                              labels={({ datum }) =>
                                `${datum.y.toLocaleString()}원`
                              }
                              style={{
                                data: { fill: "#3F51B5" },
                                labels: { fill: "black", fontSize: 8 },
                              }}
                              labelComponent={<VictoryLabel />}
                            />
                          </VictoryChart>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
            <p
              style={{
                margin: "5px",
                fontSize: "16px",
                borderBottom: "1px solid #bebfbf",
              }}
            >
              <TrendingUpIcon /> {codeName} 주식 차트 [3개월]
              <br />
              <label className="m-1 border rounded p-1" for="radio1">
                캔들차트
                <input
                  type="radio"
                  value="1"
                  id="radio1"
                  onClick={(e) => {
                    chartTypeSelect(e);
                  }}
                  name="chart_option"
                />
              </label>
              <label className="m-1 border rounded p-1" for="radio2">
                선 차트
                <input
                  type="radio"
                  value="2"
                  id="radio2"
                  onClick={(e) => {
                    chartTypeSelect(e);
                  }}
                  name="chart_option"
                />
              </label>
            </p>
            <Grid container direction="row" spacing={1}>
              <Grid xs={12} lg={12}>
                <VictoryChart
                  width={700}
                  height={300}
                  domainPadding={{ x: 10 }}
                >
                  <VictoryAxis
                    style={{
                      ticks: { stroke: "grey", size: 5 },
                      tickLabels: {
                        fontSize: 7,
                        padding: 5,
                        fontWeight: "bold",
                      },
                    }}
                    tickFormat={(x, i) => {
                      if (i % 15 === 0 || i == 89) {
                        return x;
                      }
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      axis: { stroke: "#756f6a" },
                      grid: {
                        stroke: "grey",
                      },
                      ticks: { stroke: "grey", size: 7 },
                      tickLabels: {
                        fontSize: 7,
                        padding: 5,
                        fontWeight: "bold",
                      },
                    }}
                  />
                  {(() => {
                    if (chartType === "1") {
                      return (
                        <VictoryCandlestick
                          candleColors={{
                            positive: "#ff4444",
                            negative: "#17a6ff",
                          }}
                          candleWidth={5}
                          data={graphData}
                        />
                      );
                    } else if (chartType === "2") {
                      var line_grap_data = graphData.map(function (item) {
                        return { x: item.x, y: item.close };
                      });
                      return (
                        <VictoryLine
                          style={{
                            data: { stroke: "#3F51B5" },
                          }}
                          animate={{ duration: 300 }}
                          data={line_grap_data}
                        />
                      );
                    }
                  })()}
                </VictoryChart>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default connect(
  ({ stock, stocklist }) => ({
    code: stock.code,
    group: stock.group,
    list: stocklist.list,
    allStock: stock.allStock,
  }),
  {
    select,
    groupChoice,
    getList,
    setAllStock,
  }
)(Analyze);
