import React from "react";
import SelectEle from '../atoms/Select/index'
import OptionEle from '../atoms/Select/option'
export default function StockListCondition({ fnChange, option }) {  
    if(!option) {
      return null;
    }
    var optionlist = Object.keys(option).map(function(key, i){
        if(i>0)
            return <OptionEle value={key} label={option[key].label} keyid={i} id={option[key].class} dtype={option[key].option} />
        else
            return <OptionEle value={""} label={"선택"}  keyid={i}/>
    })
    
  return (
    <SelectEle fnChange={fnChange} option={optionlist} key={1}/>
  );
}
