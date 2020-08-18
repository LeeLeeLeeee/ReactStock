import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchInput from '../molecules/searchbox'


const useStyles = makeStyles((theme) => ({
    title: {
      color: theme.palette.common.white,
      margin:theme.spacing(1)
    },
  }));
  

export default function Rayout() {
    
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <SearchInput/>
          </Toolbar>
        </AppBar>

      </div>
    );
}