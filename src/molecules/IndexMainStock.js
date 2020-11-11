import React  from "react";
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import RemoveIcon from '@material-ui/icons/Remove';
const classStyle = makeStyles((theme) => ({
    root : {
        marginRight:"5px",
        color:"white",
        display:"inline-flex"
    },
    dn : {
        color:"#17a6ff",
        marginRight:"5px",
        display:"inline-flex"
    },
    up : {
        color:"#ff4444",
        marginRight:"5px",
        display:"inline-flex"
    }
  }));

export default function searchbox({prop, label}){
    const classes = classStyle();
    const up_dn_class = prop["up_dn"] === "" ? "" : classes[prop["up_dn"]];
    var up_dn_label = ""
    var up_dn_arrow = ""
    switch(prop["up_dn"]) {
        case "up":
            up_dn_label = "상승"
            up_dn_arrow = <KeyboardArrowUpIcon />
            break;
        case "dn":
            up_dn_label = "하락"
            up_dn_arrow = <KeyboardArrowDownIcon />
            break;
        default:
            up_dn_label = "보합"
            up_dn_arrow = <RemoveIcon />
            break;
    }
    
    return (
        <>
            <p style={{margin:"0px",color:"white",fontWeight:"bold"}}> {label} - {up_dn_label} </p>
            <div style={{display:"flex"}}>
                <strong className={up_dn_class}> {prop.value}&#8361; </strong>
                <small className={up_dn_class}> {up_dn_arrow} {prop["fluc_v"]} </small>
                <small className={up_dn_class}> {prop["fluc_ratio"].replace("상승","")} </small>
            </div>
        </>  
    )
}
