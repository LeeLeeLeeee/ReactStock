import React from "react";
import { connect } from "react-redux";
import {select} from "../modules/stocklist";
import DefaultBox from '../atoms/Box'

const Rayout = ({list}) => {
  return (
    <div>
        {list.map(item=>(
            <DefaultBox>{item.code}</DefaultBox>
        ))}
        
    </div>
  );
};

export default connect(
  ({ stocklist }) => ({
    list: stocklist.list
  }),{
    select
  }
)(Rayout);
