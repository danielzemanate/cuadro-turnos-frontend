import { Fragment } from 'react';
import { GlobalContainerStyled } from './components/GlobalStyled';
import { createTheme } from './constants/theme';
import { ThemeProvider } from 'styled-components';
import AppRouter from './router/AppRouter';

function App() {
  const theme = createTheme();

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <GlobalContainerStyled />
        <AppRouter />
      </ThemeProvider>
    </Fragment>
  );
}

export default App;
