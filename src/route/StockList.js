import React, { useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { select, groupChoice } from "../modules/stock";
import { getList, setOption, setFilteredList } from "../modules/stocklist";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Header from "../molecules/StockListHead";
import Condition from "../molecules/StockListCondition";
import ListTable from "../molecules/AutoSizeTable/AutoSizeTable";
import HoverLabel from "../atoms/Label/HoverLabel";
import Button from "@material-ui/core/Button";
import ChipList from "../molecules/ChipLabel";
import ArrowDropUpOutlinedIcon from "@material-ui/icons/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
import CircularProgress from '@material-ui/core/CircularProgress';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: "50px"
    
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    maxHeight: "200px",
    overflowY: "auto",
    overflowX: "auto",
    transition: ".25s all",
  },
  btn: {
    margin: "4px",
    cursor:'pointer'
  },
  textField: {
    borderStyle: "solid",
    borderImageWidth: "0 0 5px 0",
    borderImage: "linear-gradient(to right, #01c9ca 0%, #3886FF 100%)",
    padding: "0.3rem",
    borderImageSlice: "1",
    "&:focus": {
      outline: "none",
    },
  },
}));

/* 함수 시작 */
const StockList = function ({
  list,
  option,
  filteredList,
  history,
  setOption,
  setFilteredList,
}) {
  const classes = useStyles();
  
  /* 항목 메뉴들 visible_flag */
  const [itemView,setItemView] = useState(true);

  

/* 업종 이름 별로 그룹화 */
  const [groupList, setGroupList] = useState({});

  /* 선택된 항목만 리스트화 */
  /* 필터 조건 추가 */
  /* {value, operation, label, code} */
  const [showList, setShowList] = useState({
    list: [],
    filter:[],
    load: false
  });

  /* 조건 변경 */
  const fnConditionChange = useCallback(
    (e) => {
      var lg = {};

      setOption({
        code: e.target.value,
        type: e.target
          .querySelector("option:checked")
          .getAttribute("data-type"),
      });

      /* 업종으로 검색 시 */
      if (e.target.value === "51") {
        showList.list.slice(1).forEach(function (v) {
          if (!v[51].label) return true;
          if (!lg[v[51].label]) lg[v[51].label] = [];
          lg[v[51].label].push(v);
        });
      }

      setGroupList(lg);
    },
    [showList]
  );

  /* 항목 선택 */
  const fnSelectList = useCallback(
    (e) => {
      var column_box = document.getElementById("column_box");
      var chklist = column_box.querySelectorAll("input[type=checkbox]:checked");
      var option_list = [];
      var checkedvalue = Array.from(chklist).map(function (v) {
        return v.value;
      });

      /* 선택된 항목들만 보여주게 */
      if (checkedvalue.length > 0) {
        var list_show = list.map(function (item) {
          var stock_item = {};
          checkedvalue.forEach(function (v) {
            var optiontype = "";
            switch (v) {
              case "1":
              case "2":
              case "9":
              case "33":
              case "44":
              case "51":
                optiontype = "equal";
                break;
              default:
                optiontype = "compare";
                break;
            }
            stock_item[v] = {
              label: item[v],
              class: "column_" + v,
              option: optiontype,
            };
          });
          return stock_item;
        });

        fnFilteredList(list_show);

        setShowList({
          ...showList,
          list: list_show,
          filter:[]
        });
      }
    },
    [showList]
  );

  /* 옵션 추가 */
  const fnConditionAdd = useCallback(
    (e) => {
      var target = e.target;
      var option = {
        op: "",
        va: "",
        txt: "",
        cd: "",
      };
      var search_type = target.getAttribute("data-search-type");
      var option_code = target.getAttribute("data-option-code");
      var label = target.getAttribute("placeholder");
      var value = e.target.value;
      if (e.keyCode === 13) {
        option["txt"] = label;
        option["cd"] = option_code;
        if (search_type === "equal") {
          option["op"] = "=";
          option["va"] = value;
        } else {
          var operation = value.match(/[<>!=]{1,2}/g);
          if (!operation) {
            alert("조건식을 정확히 입력해주세요.");
            return null;
          } else {
            option["va"] = value.slice(operation[0].length);
            option["op"] = operation[0];
          }
        }

        showList.filter.push(option);
        //setFilterOption(filterOption.slice());
        setShowList({
          ...showList,
          filter:showList.filter.slice()
        })
        fnFilteredList(showList.list);
        e.target.value = "";
      }
    },
    [showList]
  );
  

  /* 업종 옵션 추가 */
  const fnConditionGroupAdd = useCallback(
    (e) => {
      var target = e.target;
      var option = {
        op: "",
        va: "",
        txt: "",
        cd: "",
      };

      var dtype = target.getAttribute("data-type");
      option["txt"] = "업종 이름";
      option["cd"] = "51";
      option["op"] = "=";
      option["va"] = dtype;

      showList.filter.push(option);      
       setShowList({
        ...showList,
        filter:showList.filter.slice()
      })
      fnFilteredList(showList.list);
      e.target.value = "";
    },
    [showList]
  );

  /* 옵션 삭제 */
  const fnOptionDelete = (i) => () => {
    setShowList({
      ...showList,
      filter:showList.filter.remove(i).slice()
    })
    fnFilteredList(showList.list);
  };

  /* 리스트 옵션 값에 맞춰 필터 */
  const fnFilteredList = (plist) => {
    var flist = [];

    if (showList.filter.length > 0) {
      flist = showList.filter.reduce(function (p, c) {
        return p
          .map(function (item, i) {
            if (i === 0) return item;
            if (isNaN(item[c.cd].label) && c.op !== "=" && c.op !== "!=") {
              return false;
            }
            switch (c.op) {
              case "=":
                return item[c.cd].label === c.va ? item : false;
              case ">=":
                return +item[c.cd].label >= +c.va ? item : false;
              case "<=":
                return +item[c.cd].label <= +c.va ? item : false;
              case "!=":
                return item[c.cd].label !== c.va ? item : false;
              case ">":
                return +item[c.cd].label > +c.va ? item : false;
              case "<":
                return +item[c.cd].label < +c.va ? item : false;
            }
          })
          .filter((item) => {
            return item ? true : false;
          });
      }, plist);
    } else {
      flist = plist;
    }
    setFilteredList(flist);
  };

  /* 소트할 수 있는 컬럼 소트하기 */
  const SortList = useCallback(
    (e) => {
      var sort_type = e.target.getAttribute("data-sort");
      var code = e.target.getAttribute("data-code");
      var fn_sort = "";
      if (sort_type === "asc") {
        e.target.setAttribute("data-sort", "desc");
        fn_sort = function (p, c) {
          return +p - +c;
        };
      } else {
        e.target.setAttribute("data-sort", "asc");
        fn_sort = function (p, c) {
          return +c - +p;
        };
      }
      var flist = filteredList.slice(1).sort(function (p, c) {
        if (isNaN(+p[code].label)) return 1;
        if (isNaN(+c[code].label)) return -1;
        return fn_sort(p[code].label, c[code].label);
      });
      flist.splice(0, 0, filteredList[0]);
      setFilteredList(flist);
    },
    [filteredList]
  );

  /* PER를 활용한 멀티플 구하기 */
  const fnMultiple = () => {
    if (filteredList.length === 0) {
      alert("종목 리스트를 먼저 검색하셔야 합니다.");
      return false;
    }
    if (filteredList.length > 120) {
      alert("멀티플은 120종목 이하부터 계산이 가능합니다.");
      return false;
    }
    if (!filteredList[0]["18"]) {
      alert("항목에서 PER을 선택해주세요.");
      return false;
    }
    if (!filteredList[0]["1"]) {
      alert("항목에서 종목코드를 선택해주세요.");
      return false;
    }

    var code_list = filteredList
      .slice(1)
      .map((item) => item["1"].label.substring(1))
      .join(",");
    setShowList({
      ...showList,
      load: true,
    });
    fetch("/read/itooza?code=" + code_list, {
      method: "POST",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if(res.length === 0) return false;
        filteredList[0]["111"] = {"label" : "적정주가(연합산,연결)" }
        filteredList[0]["112"] = {"label" : "적정(연합산,연결) 금액차" }
        filteredList[0]["121"] = {"label" : "적정주가(연합산,개별)" }
        filteredList[0]["122"] = {"label" : "적정(연합산,개별) 금액차" }
        filteredList[0]["131"] = {"label" : "적정주가(연간,연결)" }
        filteredList[0]["132"] = {"label" : "적정(연간,연결) 금액차" }
        filteredList[0]["141"] = {"label" : "적정주가(연간,개별)" }
        filteredList[0]["142"] = {"label" : "적정(연간,개별) 금액차" }
        filteredList[0]["151"] = {"label" : "적정주가(분기,연결)" }
        filteredList[0]["152"] = {"label" : "적정(분기,연결) 금액차" }
        filteredList[0]["161"] = {"label" : "적정주가(분기,개별)" }
        filteredList[0]["162"] = {"label" : "적정(분기,개별) 금액차" }
        filteredList.slice(1).forEach(function (item, i) {          
          var req_info = res[item["1"].label];
            var per_value = +(req_info["five_year_per"] === "N/A"
            ? item["18"].label
            : req_info["five_year_per"]);

          Object.keys(req_info).forEach(function (key, i2) {
            if (key === "five_year_per") return true;
            var eps = req_info[key] === "N/A" ? 0 : +req_info[key];
            var multiple_value = Math.floor(per_value * eps);
            var gap_value = { label: Math.floor(item["4"].label - multiple_value) };
            multiple_value = { label: multiple_value };
            switch (key) {
              case "quarter_eps_con":
                item["111"] = multiple_value;
                item["112"] = gap_value;
                break;
              case "quarter_eps":
                item["121"] = multiple_value;
                item["122"] = gap_value;
                break;
              case "year_eps_con":
                item["131"] = multiple_value;
                item["132"] = gap_value;
                break;
              case "year_eps":
                item["141"] = multiple_value;
                item["142"] = gap_value;
                break;
              case "sum_eps_con":
                item["151"] = multiple_value;
                item["152"] = gap_value;
                break;
              case "sum_eps":
                item["161"] = multiple_value;
                item["162"] = gap_value;
                break;
            }
          });
        });
        setFilteredList(filteredList);
        setShowList({
          ...showList,
          load: false,
        });
      });
  };

  /* 첫 렌더링때 실행하는 함수 */
  useEffect(() => {
    if (history.location.pathname === "/stocklist") {
      /* 첫 렌더링 때 배경 변환 */

      /* 체크 박스 가져옴 */
      var column_box = document.getElementById("column_box");
      var chklist = column_box.querySelectorAll("input[type=checkbox]");
      /* 기본 체크 */
      chklist.forEach(function (v, i) {
        if (
          i === 0 ||
          i === 3 ||
          i === 4 ||
          i === 5 ||
          i === 6 ||
          i === 7 ||
          i === 8 ||
          i === 17 ||
          i === 54
        ) {
          v.checked = true;
        }
      });
    }
  });

  if (list.length === 0) {
    history.push("/");
    return null;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" >
        <Toolbar variant="dense">
            VicStock
            <HomeRoundedIcon onClick={()=>{history.push("/")}} className={classes.btn}></HomeRoundedIcon>
        </Toolbar>
      </AppBar>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <div
              style={{
                marginTop: "0px",
                display: "flex",
                alignContent: "space-around",
              }}
            >
              <Button className={classes.btn} onClick={()=>{setItemView(!itemView)}}   variant="outlined"  >항목 선택
              { itemView ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon /> } 
              </Button>
              <Button
                className={classes.btn}
                variant="outlined"
                onClick={fnSelectList}
              >
                검색
              </Button>
              <Button onClick={fnMultiple} className={classes.btn}  variant="outlined" >
                멀티플 구하기
              </Button>
              {showList.load ? <CircularProgress /> : <></>}
            </div>
            <Grid container spaceind={1} id="column_box">
              {itemView ? <Header list={list} history={history}/> : <></> }
            </Grid>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          style={
            showList.list.length === 0
              ? { display: "none" }
              : { display: "block" }
          }
        >
          <Paper className={classes.paper}>
            <small>조건 선택</small>
            <Condition fnChange={fnConditionChange} option={showList.list[0]} />
            <ChipList fnDelete={fnOptionDelete} chipData={showList.filter} />
            {(() => {
              if (option.code === "51") {
                if (Object.keys(groupList).length > 0) {
                  var list_jsx = Object.keys(groupList).map(function (key, i) {
                    return (
                      <Grid item xs={6} lg={1} md={3}>
                        <HoverLabel
                          style={{
                            width: "80%",
                            borderLeft: "3px solid #2196f3",
                          }}
                          dtype={key}
                          onClick={fnConditionGroupAdd}
                        >
                          {key} - {groupList[key].length}
                        </HoverLabel>
                      </Grid>
                    );
                  });
                  return (
                    <>
                      <hr />
                      <Grid container spacing={1}>
                        {list_jsx}
                      </Grid>
                    </>
                  );
                }
              } else if (option.code !== "") {
                return (
                  <>
                    <hr />
                    <Grid container spacing={1}>
                      <input
                        type="text"
                        onKeyUp={fnConditionAdd}
                        data-option-code={option.code}
                        data-search-type={option.type}
                        className={classes.textField}
                        placeholder={list[0][+option.code]}
                      />
                    </Grid>
                  </>
                );
              }
            })()}
          </Paper>
        </Grid>
        {(() => {
          if (filteredList.length > 0) {
            return (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Paper
                    className={classes.paper}
                    style={{ maxHeight: "400px" }}
                  >
                    <ListTable list={filteredList} fnSort={SortList} />
                  </Paper>
                </Grid>
              </Grid>
            );
          }
        })()}
      </Grid>
    </div>
  );
};

export default connect(
  ({ stock, stocklist }) => ({
    code: stock.code,
    group: stock.group,
    list: stocklist.list,
    option: stocklist.option,
    filteredList: stocklist.filteredList,
  }),
  {
    select,
    groupChoice,
    getList,
    setOption,
    setFilteredList,
  }
)(StockList);
