import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core";
import SelectElement from "../atoms/Select/index";
import { connect } from "react-redux";
import { select, groupChoice } from "../modules/stock";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-root": {
      borderColor: "white",
      "& .MuiSvgIcon-root": {
        color: "white",
      },
      "& .MuiInputBase-input": {
        color: "white",
      },
    },
    "& .MuiFormHelperText-root": {
      color: "white",
      textAlign: "right",
    },
  },
}));

const TopBar = ({ select, groupChoice }) => {
  const classes = useStyles();
  return (
    <div>
      <TextField
        className={classes.root}
        label=""
        helperText="주식 코드 검색"
        onKeyUp={(e)=>{
          if(e.keyCode == 13) {
            select(e.target.value)
          }
          
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <SelectElement onChange={(e)=>{groupChoice(e.target.value)}} padding={"7px"}>
        <option value="">그룹 선택</option>
        <option value="a">a</option>
        <option value="b">b</option>
        <option value="c">c</option>
        <option value="d">d</option>
      </SelectElement>
    </div>
  );
};

export default connect(
  ({ stock }) => ({
    code: stock.code,
    group: stock.group,
  }),
  {
    select,
    groupChoice,
  }
)(TopBar);
