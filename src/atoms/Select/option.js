import React from 'react'
import styled from 'styled-components'

const Option = styled.option`
    font-size:12px;
    color:gray;
`


export default function StyledOption({label, value, keyid, dtype, id}){
    return (
        <Option value={value} key={keyid} id={id} data-type={dtype}>{label}</Option>
    )
}