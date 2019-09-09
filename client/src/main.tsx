import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Store from './redux/store'
import App from './App'

const rootElement = document.getElementById("app");
render(
  <Provider store={Store}>
    <App />
  </Provider>,
  rootElement);