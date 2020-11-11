import React from "react";
import styled from "styled-components";


const Radio = styled.input.attrs((props) => ({
  type: "radio"  
}))`
border-radius: 10px;
padding:0.5rem;
`;



export default function RadioItem({id = 1, keyid, name, value}) {
  return (
      <Radio id={id} value={id} key={keyid} name={name} value={value}/>
  )
}
