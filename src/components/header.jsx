import React from "react"
import brainIcon from '/assets/result(2).png'
import { Link } from 'react-router-dom'

export default function Header(){
    return(
        <>
<header id="header">
    <div id="top">
    <h1>MindCheck</h1>  
      <img src={brainIcon} alt="stressed brain icon" />
      <nav style={{textAlign: 'center', marginTop: '0px', marginLeft:'66%'}}>
      <a href="index.html">Home</a>
      <Link to="/about">About</Link>
      <a href ='graphing.html'></a>
    </nav>
    </div>
</header>
    </>
    );
}