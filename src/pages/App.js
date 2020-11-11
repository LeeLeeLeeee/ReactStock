import React, { useEffect, useState } from 'react';
import { setAllStock } from "../modules/stock";
import { BrowserRouter as Router , Route } from 'react-router-dom';
import { connect } from "react-redux";
import Intro from 'route/intro'
import StockList from 'route/StockList'
import Analyze from 'route/StockAnalyze'
import MyStockAdd from 'route/MyStockAdd'
import Container from '@material-ui/core/Container';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";


const App = ({allStock, setAllStock}) => {
  useEffect(() => {
    fetch("/api/get_stock", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setAllStock(res)
        return res;
      });
  }, []);
  return (
    <div>
      <Container maxWidth="xl">
      <AppBar position="fixed">
        <Toolbar variant="dense" style={{"cursor":"pointer"}}>
          <span id={"home"} className={"p-1"}>VicStock</span>
          <input type="text" className={"form-control d-inline-block m-1"} list={"stocklist"} style={{"width":"150px"}} />
          <datalist id="stocklist">
          {(()=>{
            return allStock.map((item)=>{
              return (
                <option value={item["stock_cd"]}>{item["stock_name"]}</option>
              )
            })
          })()}
          </datalist>
        </Toolbar>
        
      </AppBar>
        <Router>
          <Route path="/" component={Intro} exact={true}/>
          <Route path="/stocklist" component={StockList} exact={true}/>
          <Route path="/analyze/:code" component={Analyze} exact={true}/>
          <Route path="/stockadd" component={MyStockAdd} exact={true}/>
        </Router>
      </Container>
      
    </div>
  );
}

export default connect(
  ({ stock }) => ({
    allStock: stock.allStock,
  }),
  {
    setAllStock
  }
)(App);

