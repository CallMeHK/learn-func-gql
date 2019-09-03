import React from 'react'
import { render } from 'react-dom'

const App = () => <h2>app!</h2>

const rootElement = document.getElementById("app");
render(<App />, rootElement);