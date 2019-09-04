import React from 'react'
import { Link } from 'react-router-dom'


const AppBar: React.FC = () =>
  <div><ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/login">Login</Link>
    </li>
    <li>
      <Link to="/splash">Splash</Link>
    </li>
  </ul>
  <hr/></div>

export default AppBar