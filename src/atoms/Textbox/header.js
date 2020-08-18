import React from 'react';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';


const MyHeader = styled(Typography)({
  padding: '0.375rem 0.75rem',
  fontSize:"1.3em",
  fontWeight:"bold"
});

export default function Rayout({text}) {
  return <MyHeader>{text}</MyHeader>;
}