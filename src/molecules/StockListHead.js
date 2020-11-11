import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import LabelCheck from "../molecules/LabelCheckBox";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";

export default function StockListHeader({ list, history }) {
  if (list.length === 0) {
    history.push("/");
    return null;
  } else {
    const chkbox_list = list[0].map(function (column, id) {
      if (column !== "")
        return (
          <Grid item xs={6} lg={1} md={3} key={id}>
            <LabelCheck id={id} keyid={id} label={column} value={id}></LabelCheck>
          </Grid>
        );
      else return null;
    });
    return (
      <FormControl component="fieldset">
        <FormGroup aria-label="position" row>
          {chkbox_list}
        </FormGroup>
      </FormControl>
    );
  }
}
