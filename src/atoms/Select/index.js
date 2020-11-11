import React from 'react'
import styled from 'styled-components'


const Select = styled.select(props=>({
  padding: props.padding || "1rem",
  margin:  "1rem",
  borderRadius:'5px',
}))


export default function StyledSelect({fnChange, option}){
  return (
    <Select onChange={fnChange}>
      {option}
    </Select>
  )
}