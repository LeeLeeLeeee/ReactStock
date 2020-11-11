import React,{useEffect, useRef} from "react";
import { AutoSizer, MultiGrid } from "react-virtualized";
import "./AutoSizeTable.css";

export default function Render({ list, fnSort }) {
  var gridEl = useRef(null);
  var list_key = Object.keys(list[0]);
  
  useEffect(()=>{
    if(gridEl){
      gridEl.current.forceUpdateGrids();
    }
  },[list])

  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    var target = list[rowIndex][list_key[columnIndex]] || {};
    var classes;
    var sort_type = "";
    if (rowIndex === 0) classes = "Cell CellHead";
    else classes = (target.class || "") + " Cell";

    if (target.option === "compare" && rowIndex === 0) {
      classes += " sortable";
      sort_type = "asc";
    }

    return (
      <div
        key={key}
        style={style}
        className={classes}
        data-sort={sort_type}
        onClick={fnSort}
        data-code={list_key[columnIndex]}
      >
        {target.label}
      </div>
    );
  };

  const state = {
    fixedColumnCount: 1,
    fixedRowCount: 1,
    scrollToColumn: 0,
    scrollToRow: 0,
  };
  
  return (
    <AutoSizer  disableHeight>
      {({ width }) => (
        <MultiGrid
          {...state}          
          cellRenderer={cellRenderer}
          columnWidth={100}
          columnCount={list_key.length}
          height={400}
          ref={gridEl}
          rowHeight={40}
          rowCount={list.length}
          width={width}
          hideTopRightGridScrollbar
          hideBottomLeftGridScrollbar
        />
      )}
    </AutoSizer>
  );
}
