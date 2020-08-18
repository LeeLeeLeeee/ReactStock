import React from 'react';
import Header from 'organisms/headbar'
import Body from 'organisms/body'
import Container from '@material-ui/core/Container';
const App = () => {
  return (
    <div>
      <Container maxWidth="xl">
        <Header></Header>
        <Body></Body>
      </Container>
    </div>
  );
}

export default App;

