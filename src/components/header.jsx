import React from "react"
import brainIcon from '/assets/result(2).png'
export default function Header(){
    return(
        <>
<header id="header">
    <div id="top">
    <h1>MindCheck</h1>  
      <img src={brainIcon} alt="stressed brain icon" />
      <nav style={{textAlign: 'center', marginTop: '0px', marginLeft:'66%'}}>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href ='graphing.html'></a>
    </nav>
    </div>
</header>
    </>
    );
}