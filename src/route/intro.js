import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "../atoms/Dates/index";
import SearchBox from "../molecules/searchbox";
import LineUpTxt from "../molecules/LineUpTxt";
import StockStateTable from "../molecules/StockStateTable";
import IndexHorizonChart from "../molecules/IndexHorizonChart";
import IndexPieChart from "../molecules/IndexPieChart";
import PrimaryIndex from "../organisms/PrimaryIndex";
import { connect } from "react-redux";
import { select, groupChoice } from "../modules/stock";
import { getList } from "../modules/stocklist";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import TrendingUpRoundedIcon from "@material-ui/icons/TrendingUpRounded";
import EventAvailableRoundedIcon from "@material-ui/icons/EventAvailableRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

/* async function request_first(date) { //node js에서 데이터 가져왔을 때...
  return new Promise((resolve, rejected) => {
    fetch("/read/listcsv?date=" + date, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res === "none" && date !== now_date) {
          alert("검색된 데이터가 없습니다.");
          rejected("ERROR");
        } else {
          resolve(res);
        }
      });
  });
} */

async function request_first(date) {
  /* 파이썬에서 데이터 가져옴 */
  return new Promise((resolve, rejected) => {
    fetch("/py/read_tsv?date=" + date, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.length === 0) {
          alert("검색된 데이터가 없습니다.");
          rejected("ERROR");
        } else {
          resolve(res);
        }
      });
  });
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
    borderLeft: "8px solid #3f51b5",
    textAlign: "left",
    "& > p": {
      color: "black",
      fontWeight: "bold",
      margin: "0px",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  subTitle: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    margin: "0px",
  },
}));

const Intro = function ({ select, getList, history, allStock }) {
  const classes = useStyles();
  const [kospiIndex, setKospiIndex] = useState({});
  const [kosdaqIndex, setKosdaqIndex] = useState({});
  const [stockData, setStockData] = useState({
    myList: [],
    now_price: {},
  });




  const fnChange = (e) => {
    request_first(e.target.value).then(function (list) {
      if (list !== false && list !== "none") {
        getList(list);
        history.push("/stocklist");
      }
    });
  };

  useEffect(() => {
    var myStock = "";
    var stockCode = [];

    /* 코스피 크롤링 */
    fetch("/py/getIndex?item=KOSPI", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setKospiIndex(res);
        return res;
      });

    /* 코스닥 크롤링 */
    fetch("/py/getIndex?item=KOSDAQ", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setKosdaqIndex(res);
        return res;
      });

    /* DB에서 설문 목록 가져옴 */
    fetch("/api/mystock", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        myStock = res.map((item) => {
          stockCode.push(item.code);
          return {
            name: item.name,
            stock_number: item.buyNum,
            buy_price: item.buyPrice,
            code: item.code,
            total_price: item.total_price,
            buy_date: item.buy_date,
          };
        });
        /* 코드 합치기 */
        stockCode = stockCode.join(",");
        /* 코드의  데이터 최신화 */
        
        fetch("/py/setNewData?code="+stockCode, {
          method: "GET"
        })
          .then((res) => {
            return res
          })
          .then((res) => {
            /* 코드의 오늘 데이터 가져오기 */
            fetch("/py/readStockData?code="+stockCode+"&current=y", {
              method: "GET"
            })
              .then((res) => {
                return res.json();
              })
              .then((res) => {
                  Object.keys(res).forEach(key=>{
                    res[key] = parseInt(res[key][1].replace(",",""))
                  })
                  setStockData({
                    myList : myStock,
                    now_price:res
                  })
              });
          });
      });
  }, []);

  return (
    <div style={{ "padding-top": "50px" }}>
      <Grid container direction="row" justify="center" spacing={1}>
        <Grid item lg={6} xs={12}>
          <Paper className={classes.paper}>
            <p>
              <SearchRoundedIcon style={{ color: "#F44336" }} /> 종목 검색
            </p>
            <hr />
            <SearchBox fnSelect={select} list={"selList"}/>
            <datalist id="selList">
              {allStock.length ? (
                allStock.map((item) => <option value={item["stock_cd"]}>{item["stock_name"]}</option>)
              ) : (
                <></>
              )}
            </datalist>
          </Paper>
          <Paper className={classes.paper}>
            <p>
              <TrendingUpRoundedIcon style={{ color: "#F44336" }} /> 국내 금일
              주요 지수
            </p>
            <hr />
            <Grid container direction="row" justify="center" spacing={1}>
              <Grid item lg={6} xs={12}>
                <div style={{ textAlign: "center" }}>
                  {Object.keys(kospiIndex).length ? (
                    <PrimaryIndex dat={kospiIndex} label="KOSPI" />
                  ) : (
                    <CircularProgress />
                  )}
                </div>
              </Grid>
              <Grid item lg={6} xs={12}>
                <div style={{ textAlign: "center" }}>
                  {Object.keys(kosdaqIndex).length ? (
                    <PrimaryIndex dat={kosdaqIndex} label="KOSDAQ" />
                  ) : (
                    <CircularProgress />
                  )}
                </div>
              </Grid>
            </Grid>
          </Paper>
          <Paper className={classes.paper}>
            <p>
              <TrendingUpRoundedIcon style={{ color: "#F44336" }} /> MY 포트
              폴리오
              <Button
                onClick={() => {
                  history.push("/stockadd");
                }}
                className={classes.root}
                variant="contained"
                color="primary"
              >
                종목 추가
              </Button>
            </p>
            <hr />
            <Grid container direction="row" justify="center" spacing={1}>
              <Grid item lg={6} xs={12}>
                <p
                  style={{ margin: "0px", textAlign: "center", color: "black" }}
                >
                  MY 자산 현황
                </p>
                <div
                  style={{
                    padding: "10px",
                    color: "rgb(41, 41, 41)",
                  }}
                >
                  {(() => {
                    var txt1 = 0,
                      txt2 = 0,
                      txt3 = 0,
                      txt4 = 0;
                    
                      stockData.myList.forEach((item) => {
                      txt1 += stockData.now_price[item.code] * item.stock_number;
                      txt2 += item["total_price"];
                    });
                    txt3 = txt1 - txt2;
                    txt4 = ((txt1 / txt2 - 1) * 100).toFixed(2);
                    return (
                      <>
                        <LineUpTxt
                          main="총자산"
                          sub={String(txt1.format()) + "원"}
                        />
                        <LineUpTxt
                          main="투자원금"
                          sub={String(txt2.format()) + "원"}
                        />
                        <LineUpTxt
                          main="평가손익"
                          sub={String(txt3.format()) + "원"}
                        />
                        <LineUpTxt main="수익률" sub={String(txt4) + "%"} />
                      </>
                    );
                  })()}
                </div>
              </Grid>
              <Grid item lg={6} xs={12}>
                <p
                  style={{ margin: "0px", textAlign: "center", color: "black" }}
                >
                  종목별 현황
                </p>

                <StockStateTable
                  labels={["종목명", "평가손익\n수익률", "평가금액\n매수금액"]}
                  headerf
                />
                {(() => {
                  return stockData.myList.map((item) => {
                    var label = item.name;
                    var now_price = stockData.now_price[item.code] * item.stock_number;
                    var profit = now_price - item.total_price;
                    var profitratio = (
                      (now_price / item.total_price - 1) *
                      100
                    ).toFixed(2);
                    var buy_price = item.total_price;
                    var titles = [
                      label,
                      profit.format() + "\n" + profitratio + "%",
                      now_price.format() + "\n" + buy_price.format(),
                    ];
                    var up_dn_type =
                      profit === 0 ? "keep" : profit > 0 ? "up" : "dn";
                    return (
                      <StockStateTable
                        labels={titles}
                        up_dn={up_dn_type}
                        aligns={["l", "r", "r"]}
                      />
                    );
                  });
                })()}
              </Grid>
              <Grid item lg={12} xs={12}>
                {(() => {
                  var mainData = stockData.myList.map(function (item, i) {
                    return { x: item.name, y: item.total_price };
                  });

                  var subData = stockData.myList.map(function (item) {
                    var now_total_value =
                      stockData.now_price[item.code] * item.stock_number;
                    var diff = item.total_price - now_total_value;
                    var fillvalue =
                      diff === 0 ? "gray" : diff > 0 ? "#17a6ff" : "#ff4444";
                    return {
                      x: item.name,
                      y: now_total_value,
                      fill: fillvalue,
                    };
                  });

                  return (
                    <IndexHorizonChart
                      main={mainData}
                      sub={subData}
                      title="종목별 현황(그래프)"
                    />
                  );
                })()}
              </Grid>

              <Grid item lg={12} xs={12} style={{ maxWidth: "500px" }}>
                {(() => {
                  var total = stockData.myList.reduce((p, item) => {
                    return stockData.now_price[item.code] * item.stock_number + p;
                  }, 0);
                  var data = stockData.myList.map((item) => {
                    var percent = (
                      ((stockData.now_price[item.code] * item.stock_number) / total) *
                      100
                    ).toFixed(2);
                    return {
                      x: item.code,
                      y: stockData.now_price[item.code] * item.stock_number,
                      label: item.name + "\n" + percent + "%",
                    };
                  });
                  return <IndexPieChart pdata={data} title="종목 구성 비율" />;
                })()}
              </Grid>
            </Grid>
          </Paper>

          <Paper className={classes.paper}>
            <p>
              <EventAvailableRoundedIcon style={{ color: "#F44336" }} /> 일자별
              데이터 분석
            </p>
            <hr />
            <DatePicker fnChange={fnChange}></DatePicker>
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
  }
)(Intro);
