import React from "react";
import styled from "styled-components";

const CircleInput = styled.input.attrs((props) => ({
  type: "text",
  
}))`
border: 0px;
background-color:white;
display:inline-block;
border-bottom:1px solid black;
box-sizing: border-box;
width:200px;
height:20%
font-size:2rem;
padding:0.5rem;
&:focus {
  outline:none
};
::placeholder {
  color:gray
}
`;

export default function textInput(props) {
  return <CircleInput id={props.id} list={props.list} placeholder={"종목 이름 입력"}></CircleInput>;
}