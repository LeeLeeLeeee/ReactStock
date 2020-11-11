import React from "react";
import IndexMainStock from "../molecules/IndexMainStock"
import IndexSummary from "../molecules/IndexSummary"

export default function PimaryIndex({ dat, label }) {

    var now_value = dat.now_value;
    var stock_summary = dat.stock_summary;
    var trade_trend = dat.trade_trend;
    var trade_value = Object.keys(trade_trend).map(function(key){return trade_trend[key].value});
    var trade_up_dn = Object.keys(trade_trend).map(function(key){return trade_trend[key]["up_dn"]});
    return (
        <div style={{backgroundColor:"#292929",padding:"10px",textAlign:"left"}}>
            <IndexMainStock prop={now_value} label={label} />
            <IndexSummary label={["상한","상승","보합","하락","하한"]} value={stock_summary} />
            <IndexSummary label={["기관","외국인","개인"]} value={trade_value} classList={trade_up_dn} />
        </div>
    )
}

