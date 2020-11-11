import React  from "react";
import TextInput from "../atoms/input/textCircle";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const classStyle = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(1),
    }
  }));

export default function searchbox(props){
    const classes = classStyle();
    
    return (
        <div style={{"width":"100%","flexWrap":"nowrap"}}>
            <TextInput id={"stock_code"} list={props.list}></TextInput>
            <Button onClick={()=>{
                var searchvalue = document.getElementById("stock_code").value.trim();
                if(searchvalue!=="") {
                    window.location.href = "/analyze/"+searchvalue
                }
            }} className={classes.root} variant="contained" color="primary">검색</Button>
        </div>
    )
}