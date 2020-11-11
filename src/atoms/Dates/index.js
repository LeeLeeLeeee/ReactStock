import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'block',
    width:'200px',
    flexWrap: 'wrap',
    textAlign:'center',
    right:'5px',
    '& label,& input':{
        color:'black'
    },
    '& div' : {
      width:'100%'
    },
    '& input':{
      width:'100%'
    }
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color:'black'
  },
}));

export default function DatePickers({fnChange, nowDate}) {
    const classes = useStyles();
    return (
      <form className={classes.container} noValidate>
        <TextField
          id="date"
          label="날짜 데이터 검색"
          type="date"
          defaultValue={nowDate}
          className={classes.textField}
          onChange={fnChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );
  }

