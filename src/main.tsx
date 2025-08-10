import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import { persistor, store } from './redux/store/store.js';
import { BrowserRouter } from 'react-router-dom';
import App from './App.js';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
          <App />
        </StyleSheetManager>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
