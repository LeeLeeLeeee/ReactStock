import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { select, groupChoice } from "../modules/stock";
import { getList } from "../modules/stocklist";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/DialogTitle";
import { post, get } from "axios";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";

const useStyles = makeStyles((theme) => ({
  btn: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    cursor: "pointer",
    "&:hover": {
      color: "#3f51b5",
    },
  },
  Box: {
    padding: theme.spacing(1),
    borderBottom: "1px solid #b7b7b7",
    margin: theme.spacing(1),
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    "& > span": {
      display: "inline-flex",
    },
    "& > div": {
      fontSize: ".7rem",
      "& > b": {
        fontSize: ".7rem",
        color: "#3f51b5",
      },
    },
  },
}));

const MyStockControl = function ({ select, getList, history }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState({
    flag: false,
    data: {},
  });
  const [codeList, setCodeList] = React.useState({});
  const [dataslist, setDatasList] = React.useState([]);
  const [myStock, setMyStock] = React.useState([]);
  const handleClickOpen = (e, rdata) => {
    setOpen({
      ...open,
      flag: true,
      data: rdata || {},
    });
  };

  const handleClose = () => {
    setOpen({
      ...open,
      flag: false,
      data: {},
    });
  };

  const listSave = (e) => {
    var code = document.getElementById("code").value;
    var name = document.getElementById("name").value;
    var date = document.getElementById("stockDate").value;
    var price = document.getElementById("buyPrice").value;
    var num = document.getElementById("buyNum").value;

    if (
      code === "" ||
      name === "" ||
      date === "" ||
      price === "" ||
      num === ""
    ) {
      alert("모든 값을 응답해주세요.");
      return false;
    }

    var param = {};
    param["code"] = code;
    param["name"] = name;
    param["date"] = date;
    param["buyprice"] = price;
    param["buynum"] = num;

    post("/api/insert_stock", param).then((re)=>{
      alert("저장에 성공했습니다.");
      setOpen({...open,flag: false})
      get("/api/mystock").then(res=>{
        setMyStock(res.data);
      })
    })
    
  };

  const StockDelete = (id) => {
    if(window.confirm("해당 주식을 삭제하시겠습니까?")){
      post("/api/delete_stock", {"id":id}).then((re)=>{
        get("/api/mystock").then(res=>{
          setMyStock(res.data);
        });
      })
    }
    
    
  }

  const selectCode = (e) => {
    var id = e.target.id;
    var value = e.target.value;
    var selected;

    if (id === "code") {
      selected = codeList.filter((e) => {
        if (e.stock_cd === value) return true;
        return false;
      });
      if (selected.length > 0) {
        setOpen({
          ...open,
          data: { ...Object.data, name: selected[0]["stock_name"] },
        });
      }
    } else {
      selected = codeList.filter((e) => {
        if (e.stock_name === value) return true;
        return false;
      });
      if (selected.length > 0) {
        setOpen({
          ...open,
          data: { ...Object.data, code: selected[0]["stock_cd"] },
        });
      }
    }
  };

  const searchCode = (e) => {
    var id = e.target.id;
    var value = e.target.value;
    var selected;
    var type = "";

    if (id === "code") {
      type = "stock_cd";
      selected = codeList.filter((e) => {
        if (e.stock_cd.indexOf(value) > -1) return true;
      });
    } else {
      type = "stock_name";
      selected = codeList.filter((e) => {
        if (e.stock_name.indexOf(value) > -1) return true;
      });
    }
    if (selected.length < 10) {
      setDatasList(selected.map((item) => item[type]));
    } else {
      setDatasList([]);
    }
  };

  useEffect(() => {
    fetch("/api/get_stock", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setCodeList(res);
        return res;
      });

    fetch("/api/mystock", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setMyStock(res);
        return res;
      });
  }, []);

  return (
    <div style={{ paddingTop: "50px" }}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="stretch"
        spacing={1}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-lg-6 offset-3">
              <Tooltip title="종목 추가" placement="bottom-end">
                <Paper
                  className={classes.btn}
                  style={{ textAlign: "center" }}
                  onClick={handleClickOpen}
                >
                  <AddCircleOutlineOutlinedIcon fontSize={"large"} />
                </Paper>
              </Tooltip>
            </div>

            {(() => {
              if (myStock.length === 0) {
                return <></>;
              } else {
                return myStock.map(function (item) {
                  return (
                    <div className="col-sm-12  col-lg-6 offset-3">
                      <Paper className={classes.Box}>
                        <div className="w-100 d-flex align-items-center border-bottom p-1 mb-1">
                          <div className="mr-auto d-inline-flex align-items-end">
                            <EventAvailableIcon />
                            구매 시기 : {item["buy_date"]}
                          </div>
                          <button
                            class="btn btn-sm btn-outline-primary mr-1"
                            onClick={(e) => {
                              handleClickOpen(e, item);
                            }}
                          >
                            수정
                          </button>
                          <button class="btn btn-sm btn-outline-danger" onClick={()=>{StockDelete(item["code"])}}>
                            삭제
                          </button>
                        </div>
                        <div className="w-100">
                          ○ {item["name"]}[<a href="#">{item["code"]}</a>]
                        </div>

                        <div className="w-100">
                          평균 단가 :{" "}
                          <b>
                            {parseInt(item["buyPrice"]).toLocaleString("en")} 원{" "}
                          </b>
                          주식 수량 :{" "}
                          <b>
                            {parseInt(item["buyNum"]).toLocaleString("en")} 개{" "}
                          </b>
                          총 단가 :{" "}
                          <b>
                            {parseInt(item["total_price"]).toLocaleString("en")}
                            원
                          </b>
                        </div>
                      </Paper>
                    </div>
                  );
                });
              }
            })()}
          </div>
        </div>
      </Grid>
      <Dialog
        open={open.flag}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"종목 추가하기"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="text-dark"
          >
            <label>종목 코드</label>
            <input
              type="number"
              id="code"
              className="form-control mb-1"
              onChange={(e) => {
                searchCode(e);
                setOpen({
                  ...open,
                  data: { ...Object.data, code: e.target.value },
                });
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") selectCode(e);
              }}
              value={Object.keys(open.data).length === 0 ? "" : open.data.code}
              list="selList"
            />
            <label>종목 명</label>
            <input
              type="text"
              id="name"
              className="form-control mb-1"
              onChange={(e) => {
                searchCode(e);
                setOpen({
                  ...open,
                  data: { ...Object.data, name: e.target.value },
                });
              }}
              value={Object.keys(open.data).length === 0 ? "" : open.data.name}
              onKeyPress={(e) => {
                if (e.key === "Enter");
                selectCode(e);
              }}
              list="selList"
            />
            <datalist id="selList">
              {dataslist.length ? (
                dataslist.map((item) => <option value={item} />)
              ) : (
                <></>
              )}
            </datalist>
            <label>종목 구입 시점</label>
            <input
              id="stockDate"
              type="date"
              className="form-control mb-1"
              value={
                Object.keys(open.data).length === 0 ? "" : open.data.buy_date
              }
              onChange={(e) => {
                setOpen({
                  ...open,
                  data: { ...Object.data, date: e.target.value },
                });
              }}
            />
            <label>구입 금액</label>
            <input
              id="buyPrice"
              type="number"
              className="form-control mb-1"
              value={
                Object.keys(open.data).length === 0 ? "" : open.data.buyPrice
              }
              onChange={(e) => {
                setOpen({
                  ...open,
                  data: { ...Object.data, buyPrice: e.target.value },
                });
              }}
            />
            <label>구입 수량</label>
            <input
              id="buyNum"
              type="number"
              className="form-control mb-1"
              value={
                Object.keys(open.data).length === 0 ? "" : open.data.buyNum
              }
              onChange={(e) => {
                setOpen({
                  ...open,
                  data: { ...Object.data, buyNum: e.target.value },
                });
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.btn}
            onClick={listSave}
            variant="contained"
            color="primary"
          >
            SAVE
          </Button>
          <Button className={classes.btn} onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default connect(
  ({ stock, stocklist }) => ({
    code: stock.code,
    group: stock.group,
    list: stocklist.list,
  }),
  {
    select,
    groupChoice,
    getList,
  }
)(MyStockControl);
