import React  from "react";
import styled from "styled-components";
import CheckItem from '../atoms/input/checkbox'

const StyledLabel = styled.label`
  font-size:11px;
  cursor:pointer;
  padding:0.2rem;  
  margin:0.2rem;
  display:inline-block;
  width:100%;
  box-sizing:border-box;
  &:hover {
    color:black
  };
`
export default function LabelCheck({label ='-' ,id =1, keyid =1, value=1}){
    return (
        <StyledLabel htmlFor={id} key={keyid}>
            <CheckItem id={id} value={value} keyid={keyid}></CheckItem>
            {label}
        </StyledLabel>
    )
}