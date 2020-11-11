import React from "react";
import styled from "styled-components";


const Checkbox = styled.input.attrs((props) => ({
  type: "checkbox"  
}))`
border-radius: 10px;
padding:0.5rem;
`;



export default function CheckBoxItem({id = 1, keyid, value}) {
  return (
      <Checkbox id={id} value={id} key={keyid} value={value}/>
  )
}
