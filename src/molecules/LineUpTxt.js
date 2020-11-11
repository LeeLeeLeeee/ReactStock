import React  from "react";

export default function LineUpTxt({main , sub}){
    return (
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <span style={{display:'inline-flex'}}>{main}</span>
            <small style={{display:'inline-flex'}}>{sub}</small>
        </div>
    )
}