import React from 'react';

import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import MainPage from '../MainPage';

const App: React.FunctionComponent = () => {
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainPage />
    </ThemeProvider>
  );
};

export default App;
