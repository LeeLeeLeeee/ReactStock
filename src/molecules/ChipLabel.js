import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5)
  },
}));

export default function ConditionChipsArray({ chipData, fnDelete }) {
  const classes = useStyles();
  return (
    <>
      {chipData.map((data, i) => {
        var op_label = "";
        switch (data.op) {
          case "=":
            op_label = "같음";
            break;
          case ">=":
            op_label = "이상";
            break;
          case "<=":
            op_label = "이하";
            break;
          case "!=":
            op_label = "같지 않음";
            break;
          case ">":
            op_label = "초과";
            break;
          case "<":
            op_label = "미만";
            break;
        }
        return (
          
            <Chip
              variant="outlined"
              label={data.txt + " : " + data.va + "[" + op_label + "]"}
              onDelete={fnDelete(i)}
              key ={i}
              className={classes.chip}
            />
          
        );
      })}
    </>
  );
}
