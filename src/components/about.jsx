import React from 'react';
import Header from './header.jsx';
import Footer from './footer.jsx';

export default function About() {
  return (
    <div className='page-wrapper'>
      <Header />
      <main className='content-wrapper' style={{ 
        flexDirection: 'column', 
        padding: '40px 20px', 
        color: 'var(--mainText-color)',
        textAlign: 'center'
      }}>
        <div className="about-page" style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          color: 'var(--mainText-color)'
        }}>
          <h1 style={{ 
            color: 'var(--mainText-color)', 
            fontSize: '3rem', 
            marginBottom: '30px',
            textShadow: 'var(--textShadow-color) 3px 3px 3px'
          }}>
            About MindCheck!
          </h1>
          <p style={{ 
            color: 'var(--mainText-color)', 
            lineHeight: '1.8', 
            marginBottom: '25px',
            fontSize: '1.2rem',
            textShadow: 'var(--base-color) 1px 1px 1px'
          }}>
            Welcome to <strong>MindCheck</strong> — a simple, personal tool designed to help people who don't want to spend time, money, and energy on more complex resources that can leave you feeling even more stressed out.
          </p>
          <p style={{ 
            color: 'var(--mainText-color)', 
            lineHeight: '1.8', 
            marginBottom: '25px',
            fontSize: '1.2rem',
            textShadow: 'var(--base-color) 1px 1px 1px'
          }}>
            Welcome to MindCheck - a simple, personal tool designed to help
            people who don't want to spend time, money and energy on more complex resources
            that get you all bogged down and more stressed out as a result. Sticking with MindCheck
            can help you stay focused on the very specific things that are grounded in your day to day life
            so that you can track and see on a graph which things you are being affected by, whether it be you seeing you had a lower rating
            on a day you had a low sleep rating or anything else we just want to make it super simple for you.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}