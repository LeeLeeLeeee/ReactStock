import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BoxList from '../molecules/BoxList'
const useStyles = makeStyles((theme) => ({
    title: {
      color: theme.palette.common.white,
      margin:theme.spacing(1)
    },
  }));
  

export default function Rayout() {    
    return (
        <div>
            <BoxList></BoxList>
        </div>
    );
}