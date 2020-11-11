import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchInput from '../molecules/searchbox'


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