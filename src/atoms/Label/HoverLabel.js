import styled from "styled-components";


const hoverLabel = styled.label.attrs((props)=>({
  "data-type":props.dtype
}))`
  font-size:10px;
  cursor:pointer;
  color:gray;
  padding:0.2rem;
  margin:0.2rem;
  display:inline-block;
  width:100%;
  box-sizing:border-box;
  &:hover {
    color:black
  };
`
export default hoverLabel