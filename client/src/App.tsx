import React from 'react'
import { HashRouter, Route } from 'react-router-dom'

import { Home, LogIn, Splash } from './views/views'
import AppBar from './components/AppBar'

const App: React.FC = () => {
  return <HashRouter>
    <AppBar />
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={LogIn} />
      <Route path="/splash" component={Splash} />
    </div>
  </HashRouter>
}

export default App