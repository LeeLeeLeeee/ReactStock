import React  from "react";
import styled from "styled-components";
import RadioItem from '../atoms/input/radio'

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
export default function LabelRadio({label ='-' ,id =1, keyid =1, name= "radio_name", value}){
    return (
        <StyledLabel htmlFor={id} key={keyid}>
            <RadioItem id={id} keyid={keyid} name={name} value={value}></RadioItem>
            {label}
        </StyledLabel>
    )
}