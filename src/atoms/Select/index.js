import styled from 'styled-components'

const StyledSelect = styled.select(props=>({
  padding: props.padding || "5px",
  margin:  "5px",
  position:'absolute',
  right:'5px',
  fontWeight:'bold',
  height:'70%'
}))


export default StyledSelect