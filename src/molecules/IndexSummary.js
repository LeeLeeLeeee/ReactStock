import React  from "react";
import { makeStyles } from '@material-ui/core/styles';

const classStyle = makeStyles((theme) => ({
    root : {
        color:"white",
        display:"inline-flex",
        padding:"3px"
        
    },
    dn : {
        color:"#17a6ff",
        display:"inline-flex",
        padding:"3px"
    },
    up : {
        color:"#ff4444",
        display:"inline-flex",
        padding:"3px"
    }
  }));

export default function searchbox({label, value, classList}){
    const classes = classStyle();
    return (
        <div style={{display:"flex"}}>
            {(()=>{
                return label.map(function(txt, i){
                    return (
                        <small className={!classList ? classes["root"] : classes[classList[i]]}>{txt} {value[i]} </small>
                    )
                })
            })()}

        </div>
    )
}
