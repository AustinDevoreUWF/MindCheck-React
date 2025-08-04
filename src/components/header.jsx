import React from "react"
import brainIcon from '/assets/favicon.png'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header id="header">
      <div id="top">
        <h1>MindCheck</h1>
        <img src={brainIcon} alt="stressed brain icon" />
        <nav style={{ textAlign: 'center', marginTop: '0px', marginLeft: '66%' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
