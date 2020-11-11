import React,{Component} from "react";
import { AutoSizer, MultiGrid } from "react-virtualized";
import "./AutoSizeTable.css";

class StockTable extends Component {

  constructor(props, context) {
    console.log(props);
    super(props, context);
    this.state = {
      fixedColumnCount: 1,
      fixedRowCount: 1,
      scrollToColumn: 0,
      scrollToRow: 0,
    }
    this._cellRenderer = this._cellRenderer.bind(this);
    this.list = props.list;
    this.fnSort = props.fnSort;
    this.list_key = Object.keys(props.list[0])
    this._setRef = this._setRef.bind(this);
  }

  componentDidMount () {
    console.log(this.list[1]);
    this._multiGrid.forceUpdate();
  }
  
  
  render() {
    
    return (
      <AutoSizer  disableHeight>
      {({ width }) => (
        <MultiGrid
          {...this.state}          
          cellRenderer={this._cellRenderer}
          columnWidth={100}
          columnCount={this.list_key.length}
          height={400}
          rowHeight={40}
          ref={this._setRef}
          rowCount={this.list.length}
          width={width}
          hideTopRightGridScrollbar
          hideBottomLeftGridScrollbar
        />
      )}
    </AutoSizer>
    )
  }

  _cellRenderer({columnIndex, key, rowIndex, style}) {
    var target = this.list[rowIndex][this.list_key[columnIndex]];
    var classes;
    var sort_type = "";
    if (rowIndex === 0) classes = "Cell CellHead";
    else classes = target.class + " Cell";

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
        onClick={(e)=>{this.fnSort(e)}}
        data-code={this.list_key[columnIndex]}
      >
        {target.label}
      </div>
    );
  }

  _setRef (ref) {
    this._multiGrid = ref;
  }
  
}

export default StockTable